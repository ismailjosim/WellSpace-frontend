"use server";

import { serverFetch } from "@/lib/server-fetch";

type ApiResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

const readResult = async <T>(response: Response): Promise<ApiResult<T>> => {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok && result.success) {
    return {
      success: false,
      message: "The pharmacy request could not be completed.",
    };
  }
  return result;
};

export async function getMedicines(query = "") {
  try {
    return await readResult(
      await serverFetch.get(`/medicine${query ? `?${query}` : ""}`, {
        cache: "no-store",
      }),
    );
  } catch (error) {
    console.error("Unable to load medicine catalog:", error);
    return { success: false, message: "Unable to load the medicine catalog." };
  }
}

export async function getShopOverview() {
  try {
    return await readResult(
      await serverFetch.get("/medicine/management/overview", {
        cache: "no-store",
      }),
    );
  } catch (error) {
    console.error("Unable to load shop overview:", error);
    return { success: false, message: "Unable to load shop overview." };
  }
}

export async function getAdminShopOverview() {
  try {
    return await readResult(
      await serverFetch.get("/medicine/admin-overview", { cache: "no-store" }),
    );
  } catch (error) {
    console.error("Unable to load pharmacy overview:", error);
    return { success: false, message: "Unable to load pharmacy overview." };
  }
}

export async function getShopMedicines() {
  try {
    return await readResult(
      await serverFetch.get("/medicine/management", { cache: "no-store" }),
    );
  } catch (error) {
    console.error("Unable to load shop inventory:", error);
    return { success: false, message: "Unable to load shop inventory." };
  }
}

export async function getShopOrders() {
  try {
    return await readResult(
      await serverFetch.get("/medicine/orders", { cache: "no-store" }),
    );
  } catch (error) {
    console.error("Unable to load pharmacy orders:", error);
    return { success: false, message: "Unable to load pharmacy orders." };
  }
}

export async function getMyMedicineOrders() {
  try {
    return await readResult(
      await serverFetch.get("/medicine/orders/my", { cache: "no-store" }),
    );
  } catch (error) {
    console.error("Unable to load medicine orders:", error);
    return { success: false, message: "Unable to load your medicine orders." };
  }
}

export async function placeMedicineOrder(formData: FormData) {
  try {
    return await readResult(
      await serverFetch.post("/medicine/orders", { body: formData }),
    );
  } catch (error) {
    console.error("Unable to place medicine order:", error);
    return { success: false, message: "Unable to place your order." };
  }
}

export async function updateMedicineOrderStatus(
  id: string,
  payload: Record<string, string>,
) {
  try {
    return await readResult(
      await serverFetch.patch(`/medicine/orders/${id}/status`, {
        body: JSON.stringify(payload),
      }),
    );
  } catch (error) {
    console.error("Unable to update medicine order:", error);
    return { success: false, message: "Unable to update the order." };
  }
}

export async function updateMedicineStock(id: string, stock: number) {
  try {
    return await readResult(
      await serverFetch.patch(`/medicine/${id}/stock`, {
        body: JSON.stringify({ stock }),
      }),
    );
  } catch (error) {
    console.error("Unable to update medicine stock:", error);
    return { success: false, message: "Unable to update inventory." };
  }
}

export async function createMedicine(formData: FormData) {
  try {
    return await readResult(
      await serverFetch.post("/medicine", { body: formData }),
    );
  } catch (error) {
    console.error("Unable to add medicine:", error);
    return { success: false, message: "Unable to add medicine." };
  }
}

export async function updateMedicine(id: string, formData: FormData) {
  try {
    return await readResult(
      await serverFetch.patch(`/medicine/${id}`, { body: formData }),
    );
  } catch (error) {
    console.error("Unable to update medicine:", error);
    return { success: false, message: "Unable to update medicine." };
  }
}

export async function deactivateMedicine(id: string) {
  try {
    return await readResult(await serverFetch.delete(`/medicine/${id}`));
  } catch (error) {
    console.error("Unable to deactivate medicine:", error);
    return { success: false, message: "Unable to remove the medicine." };
  }
}

export async function startMedicinePayment(id: string) {
  try {
    return await readResult<{ paymentUrl: string }>(
      await serverFetch.post(`/medicine/orders/${id}/pay`),
    );
  } catch (error) {
    console.error("Unable to start medicine payment:", error);
    return { success: false, message: "Unable to start payment." };
  }
}

export async function verifyMedicinePayment(sessionId: string) {
  try {
    const query = new URLSearchParams({ sessionId });
    return await readResult(
      await serverFetch.get(`/medicine/orders/payment-status?${query}`, {
        cache: "no-store",
      }),
    );
  } catch (error) {
    console.error("Unable to verify medicine payment:", error);
    return { success: false, message: "Unable to verify the payment status." };
  }
}

export async function getMedicinePrescription(id: string) {
  try {
    return await readResult<{ url: string }>(
      await serverFetch.get(`/medicine/orders/${id}/prescription`, {
        cache: "no-store",
      }),
    );
  } catch (error) {
    console.error("Unable to load medicine prescription:", error);
    return { success: false, message: "Unable to open the prescription." };
  }
}

export async function getShopStaff() {
  try {
    return await readResult(
      await serverFetch.get("/admin/shop-staff", { cache: "no-store" }),
    );
  } catch (error) {
    console.error("Unable to load shop staff:", error);
    return { success: false, message: "Unable to load shop staff." };
  }
}

export async function createShopStaff(payload: {
  name: string;
  email: string;
  contactNumber: string;
  role: "SHOP_MANAGER" | "SHOP_ASSISTANT";
  password: string;
}) {
  try {
    return await readResult(
      await serverFetch.post("/user/create-shop-staff", {
        body: JSON.stringify({
          password: payload.password,
          shopStaff: {
            name: payload.name,
            email: payload.email,
            contactNumber: payload.contactNumber,
            role: payload.role,
          },
        }),
      }),
    );
  } catch (error) {
    console.error("Unable to create shop staff account:", error);
    return {
      success: false,
      message: "Unable to create the shop staff account.",
    };
  }
}
