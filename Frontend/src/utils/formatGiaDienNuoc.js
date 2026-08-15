const GIA_DIEN_MIN = 1728;
const GIA_DIEN_MAX = 3015;
const GIA_NUOC_MIN = 3500;
const GIA_NUOC_MAX = 18000;

const validateGiaDien = (value) => {
    const num = Number(value.replace(/\./g, ""));
    return num >= GIA_DIEN_MIN && num <= GIA_DIEN_MAX;
};

const validateGiaNuoc = (value) => {
    const num = Number(value.replace(/\./g, ""));
    return num >= GIA_NUOC_MIN && num <= GIA_NUOC_MAX;
};

export { validateGiaDien, validateGiaNuoc };