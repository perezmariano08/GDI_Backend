const URL_API =
    process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://apigolesdeinstituto.vercel.app";


module.exports = { URL_API };