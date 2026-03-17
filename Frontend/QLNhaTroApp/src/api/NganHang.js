export const getAllNganHangApi = async () => {
    try {
        const res = await fetch('https://api.vietqr.io/v2/banks');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching ngan hang:', error);
        throw error;
    }
};