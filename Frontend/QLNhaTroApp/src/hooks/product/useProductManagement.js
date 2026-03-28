import { useState, useEffect } from "react";
import { getDichVusByNccService, createDichVuService, updateDichVuService, deleteDichVuService, updateDichVuStatusService } from "../../services/dichVuService";
import toast from "../../utils/toast";

export const useProductManagement = (maNcc) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        if (!maNcc) return;
        try {
            setLoading(true);
            const data = await getDichVusByNccService(maNcc);
            setProducts(data);
        } catch (error) {
            console.error("fetchProducts error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [maNcc]);

    const addProduct = async (data) => {
        try {
            setLoading(true);
            const res = await createDichVuService(data);
            if (res.success) {
                toast.success("Thêm sản phẩm thành công!");
                fetchProducts();
                return true;
            } else {
                toast.error(res.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi thêm: " + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id, data) => {
        try {
            setLoading(true);
            const res = await updateDichVuService(id, data);
            if (res.success) {
                toast.success("Cập nhật thành công!");
                fetchProducts();
                return true;
            } else {
                toast.error(res.message);
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = async (id) => {
        try {
            setLoading(true);
            const res = await deleteDichVuService(id);
            if (res.success) {
                toast.success("Xóa sản phẩm thành công");
                await fetchProducts();
                return true;
            } else {
                toast.error("Xóa thất bại: " + res.message);
                return false;
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            setLoading(true);
            const res = await updateDichVuStatusService(id, status);
            console.log(res);
            if (res.success) {
                toast.success(res.message || "Cập nhật thành công");
                await fetchProducts();
                return true;
            } else {
                toast.error(res.message || "Cập nhật thất bại");
                return false;
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật" + error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        addProduct,
        updateProduct,
        removeProduct,
        updateStatus,
        refresh: fetchProducts
    };
};
