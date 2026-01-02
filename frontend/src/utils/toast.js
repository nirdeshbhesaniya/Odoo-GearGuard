import toast from 'react-hot-toast';

// Toast configuration
const toastConfig = {
    duration: 4000,
    position: 'top-right',
    style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
        fontSize: '14px',
        maxWidth: '500px',
    },
    success: {
        iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
        },
    },
    error: {
        iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
        },
    },
};

// Success toast
export const showSuccess = (message) => {
    toast.success(message, toastConfig);
};

// Error toast
export const showError = (message) => {
    toast.error(message, toastConfig);
};

// Info toast
export const showInfo = (message) => {
    toast(message, {
        ...toastConfig,
        icon: 'ℹ️',
    });
};

// Warning toast
export const showWarning = (message) => {
    toast(message, {
        ...toastConfig,
        icon: '⚠️',
        style: {
            ...toastConfig.style,
            background: '#f59e0b',
        },
    });
};

// Loading toast
export const showLoading = (message) => {
    return toast.loading(message, toastConfig);
};

// Update loading toast
export const updateLoading = (toastId, message, type = 'success') => {
    if (type === 'success') {
        toast.success(message, { id: toastId, ...toastConfig });
    } else if (type === 'error') {
        toast.error(message, { id: toastId, ...toastConfig });
    }
};

// Dismiss toast
export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};

// Promise toast - automatically handles loading, success, and error
export const showPromise = (promise, messages) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading || 'Loading...',
            success: messages.success || 'Success!',
            error: messages.error || 'Something went wrong',
        },
        toastConfig
    );
};

// API Error handler - extracts meaningful error messages
export const handleApiError = (error) => {
    let message = 'An unexpected error occurred';

    if (error.response) {
        // Server responded with error
        const { data } = error.response;

        if (data.message) {
            message = data.message;
        } else if (data.errors && Array.isArray(data.errors)) {
            // Validation errors
            message = data.errors.map(e => e.message).join(', ');
        } else if (data.error) {
            message = data.error;
        }
    } else if (error.request) {
        // Network error
        message = 'Network error. Please check your connection.';
    } else if (error.message) {
        message = error.message;
    }

    showError(message);
    return message;
};

export default {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    updateLoading,
    dismiss: dismissToast,
    promise: showPromise,
    handleApiError,
};
