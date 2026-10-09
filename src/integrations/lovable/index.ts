export const lovable = {
  auth: {
    signInWithOAuth: async () => {
      return { error: new Error("OAuth is not configured on the local REST backend.") };
    },
  },
};
