// A. Abstração: classe base abstrata Item com id, descricao e render() abstrato
abstract class Item {
  id: number;
  descricao: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.descricao = description;
  }

  abstract render(): HTMLElement;
}

// C. Herança: Tarefa estende Item
class Tarefa extends Item {
  // B. Encapsulamento: atributo privado concluida
  private concluida: boolean = false;

  constructor(id: number, description: string) {
    super(id, description);
  }

  // B. Encapsulamento: métodos públicos concluir(), desfazer() e isConcluida()
  concluir(): void {
    this.concluida = true;
  }

  desfazer(): void {
    this.concluida = false;
  }

  isConcluida(): boolean {
    return this.concluida;
  }

  // D. Polimorfismo: implementação de render() que retorna o elemento HTML da tarefa
  render(): HTMLElement {
    const li = document.createElement("li");
    li.className = "task";
    if (this.concluida) {
      li.classList.add("completed");
    }

    // Fluxo 4: checkbox para marcar como concluída
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = this.concluida;

    // Fluxo 4: texto da descrição
    const text = document.createElement("span");
    text.textContent = this.descricao;

    // Extensão: edição de tarefas
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Editar";

    // E. Remover tarefas (opcional)
    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "Remover";

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(editButton);
    li.appendChild(removeButton);

    return li;
  }
}

// Extensão: formato salvo no localStorage
interface SavedTask {
  id: number;
  descricao: string;
  concluida: boolean;
}

// Extensão: filtros (todas, concluídas, pendentes)
type Filter = "all" | "pending" | "completed";

// E. Classe gerenciadora
class GerenciadorDeTarefas {
  // E. Armazenar uma lista de Tarefa
  private tasks: Tarefa[] = [];
  private nextId: number = 1;
  private filter: Filter = "all";

  private list: HTMLUListElement;
  private totalSpan: HTMLElement;
  private completedSpan: HTMLElement;
  private pendingSpan: HTMLElement;

  constructor() {
    this.list = document.getElementById("taskList") as HTMLUListElement;
    this.totalSpan = document.getElementById("total") as HTMLElement;
    this.completedSpan = document.getElementById("completed") as HTMLElement;
    this.pendingSpan = document.getElementById("pending") as HTMLElement;

    this.load();
    this.renderList();
  }

  // E. Criar novas tarefas / Fluxo 2: nova instância de Tarefa
  createTask(description: string): void {
    const text = description.trim();
    if (text === "") {
      alert("Digite uma descrição para a tarefa!");
      return;
    }

    const newTask = new Tarefa(this.nextId, text);
    this.nextId++;
    this.tasks.push(newTask);

    this.save();
    this.renderList();
  }

  // E. Remover tarefas (opcional)
  removeTask(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
    this.renderList();
  }

  // Fluxo 5: estado muda via concluir() e a interface é atualizada
  toggleTask(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;

    if (task.isConcluida()) {
      task.desfazer();
    } else {
      task.concluir();
    }

    this.save();
    this.renderList();
  }

  // Extensão: edição de tarefas
  editTask(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;

    const newText = prompt("Editar tarefa:", task.descricao);
    if (newText !== null && newText.trim() !== "") {
      task.descricao = newText.trim();
      this.save();
      this.renderList();
    }
  }

  // Extensão: filtros
  changeFilter(filter: Filter): void {
    this.filter = filter;
    this.renderList();
  }

  // Extensão: filtros
  private filteredTasks(): Tarefa[] {
    if (this.filter === "pending") {
      return this.tasks.filter((t) => !t.isConcluida());
    }
    if (this.filter === "completed") {
      return this.tasks.filter((t) => t.isConcluida());
    }
    return this.tasks;
  }

  // E. Atualizar estatísticas / Fluxo 6: total, concluídas e pendentes
  updateStats(): void {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.isConcluida()).length;
    const pending = total - completed;

    this.totalSpan.textContent = String(total);
    this.completedSpan.textContent = String(completed);
    this.pendingSpan.textContent = String(pending);
  }

  // E. Renderizar a lista no DOM / Fluxo 3: a tarefa aparece na lista
  renderList(): void {
    this.list.innerHTML = "";

    const tasksToShow = this.filteredTasks();

    for (const task of tasksToShow) {
      // D. Polimorfismo: cada tarefa se desenha com render()
      const element = task.render();

      const checkbox = element.querySelector(".check") as HTMLInputElement;
      checkbox.addEventListener("change", () => this.toggleTask(task.id));

      const editButton = element.querySelector(
        ".edit-button",
      ) as HTMLButtonElement;
      editButton.addEventListener("click", () => this.editTask(task.id));

      const removeButton = element.querySelector(
        ".remove-button",
      ) as HTMLButtonElement;
      removeButton.addEventListener("click", () => this.removeTask(task.id));

      this.list.appendChild(element);
    }

    this.updateStats();
  }

  // Extensão: persistência no localStorage
  private save(): void {
    const data: SavedTask[] = this.tasks.map((t) => ({
      id: t.id,
      descricao: t.descricao,
      concluida: t.isConcluida(),
    }));
    localStorage.setItem("tarefas", JSON.stringify(data));
  }

  // Extensão: persistência no localStorage
  private load(): void {
    const text = localStorage.getItem("tarefas");
    if (text === null) return;

    const data: SavedTask[] = JSON.parse(text);

    for (const entry of data) {
      const task = new Tarefa(entry.id, entry.descricao);
      if (entry.concluida) {
        task.concluir();
      }
      this.tasks.push(task);

      if (entry.id >= this.nextId) {
        this.nextId = entry.id + 1;
      }
    }
  }
}

const manager = new GerenciadorDeTarefas();

const input = document.getElementById("taskInput") as HTMLInputElement;
const addButton = document.getElementById("addButton") as HTMLButtonElement;

// Fluxo 1: o usuário digita uma descrição e clica em Adicionar
addButton.addEventListener("click", () => {
  manager.createTask(input.value);
  input.value = "";
  input.focus();
});

// Extensão: botões de filtro
const filterButtons = document.querySelectorAll(".filter-button");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const filter = (button as HTMLButtonElement).dataset.filter as Filter;
    manager.changeFilter(filter);
  });
});
