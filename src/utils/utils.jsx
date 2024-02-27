// googleScript.js
export const callGoogleScript = async (apiFunction) => {
    try {
        const response = await google.script.run[apiFunction];
        return response; // Return the response from the Google Apps Script function
    } catch (error) {
        throw new Error(error.message); // Throw an error if there's an exception
    }
};



