const HUtil = {

    isValidString: (value) => {
        return value !== null && value !== undefined && value.trim() !== "";
    },

    isValidEmail: (email) => {
        if (!HUtil.isValidString(email)) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return regex.test(email);
    },

    isEmailOrUsername: (value) => {
        if (!HUtil.isValidString(value)) return false;

        if (value.includes("@")) {
            return HUtil.isValidEmail(value);
        }

        const usernameRegex = /^[a-zA-Z0-9._-]{3,}$/;
        return usernameRegex.test(value);
    },

    getOrDefault: (value, defaultValue) => {
        return value !== null && value !== undefined ? value : defaultValue;
    }
};

export default HUtil;