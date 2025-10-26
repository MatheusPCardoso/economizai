import axiosClient from "@lib/http.service";
import { action, computed, makeObservable, reaction, runInAction } from "mobx";
import RootStore from "./root";
import ManagerStore from "./manager.store";

export class Subcategory {
  id!: string;
  name!: string;
  icon!: string;
  isDefault!: boolean;
  categoryId!: string;
}

export class Category {
  id!: string;
  name!: string;
  icon!: string;
  isDefault!: boolean;
  type!: "INCOME" | "EXPENSE";
  subcategories?: Subcategory[];
}

class CategoryStore extends ManagerStore<Category> {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    super(rootStore, Category);
    this.rootStore = rootStore;

    makeObservable(this, {
      initialLoad: action,
      createCategory: action.bound,
      updateCategory: action.bound,
      deleteCategory: action,
      createSubcategory: action.bound,
      updateSubcategory: action.bound,
      deleteSubcategory: action,
      getCategoryById: action,
      incomes: computed,
      expenses: computed,
    });

    reaction(
      () => this.rootStore.walletStore.currentWalletId,
      (currentWalletId, prevValue) => {
        if (currentWalletId && prevValue !== currentWalletId) {
          this.initialLoad();
        }
      }
    );
  }

  async initialLoad() {
    try {
      const { data } = await axiosClient.get<Category[]>(`/category/wallet`, {
        params: {
          id: this.rootStore.walletStore.currentWalletId,
        },
      });
      if (!data) return;

      runInAction(() => {
        data.forEach((item: Category) => this.create(item));
      });
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      throw error;
    }
  }

  get incomes() {
    return this.items.filter((item) => item.type === "INCOME");
  }

  get expenses() {
    return this.items.filter((item) => item.type === "EXPENSE");
  }

  async createCategory(payload: Omit<Category, "id">) {
    try {
      const { data } = await axiosClient.post<Category>("/category", payload);

      runInAction(() => {
        this.create(data);
      });
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw error;
    }
  }

  async updateCategory(payload: Category) {
    try {
      const { id, ...updateData } = payload;
      const { data } = await axiosClient.patch<Category>(
        `/category/${id}`,
        updateData
      );
      runInAction(() => this.update(data));
    } catch (error) {
      console.error(`Erro ao atualizar categoria ${payload.id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      await axiosClient.delete(`/category/${id}`);
      runInAction(() => this.delete(id));
    } catch (error) {
      console.error(`Erro ao deletar categoria ${id}:`, error);
      throw error;
    }
  }

  async createSubcategory(payload: { name: string; categoryId: string }) {
    try {
      const { data } = await axiosClient.post<Subcategory>(
        "/category/subcategory",
        payload
      );
      runInAction(() => {
        const parentCategory = this.getCategoryById(payload.categoryId);

        if (parentCategory) {
          if (!parentCategory.subcategories) {
            parentCategory.subcategories = [];
          }
          parentCategory.subcategories.push(data);
        }
      });
    } catch (error) {
      console.error("Erro ao criar subcategoria:", error);
      throw error;
    }
  }

  async updateSubcategory(payload: {
    id: string;
    name: string;
    categoryId: string;
  }) {
    try {
      const { data } = await axiosClient.patch<Subcategory>(
        `/category/subcategory/${payload.id}`,
        {
          name: payload.name,
        }
      );
      runInAction(() => {
        const parentCategory = this.getCategoryById(payload.categoryId);
        if (parentCategory && parentCategory.subcategories) {
          const index = parentCategory.subcategories.findIndex(
            (sub) => sub.id === payload.id
          );
          if (index !== -1) {
            parentCategory.subcategories[index] = data;
          }
        }
      });
    } catch (error) {
      console.error("Erro ao atualizar subcategoria:", error);
      throw error;
    }
  }

  getCategoryById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  async deleteSubcategory(id: string, categoryId: string) {
    try {
      await axiosClient.delete(`/category/subcategory/${id}`);
      runInAction(() => {
        const parentCategory = this.getCategoryById(categoryId);
        if (parentCategory?.subcategories) {
          parentCategory.subcategories = parentCategory.subcategories.filter(
            (sub) => sub.id !== id
          );
        }
      });
    } catch (error) {
      console.error(`Erro ao deletar subcategoria ${id}:`, error);
      throw error;
    }
  }
}

export default CategoryStore;
