export const USER_LOGIN = `${process.env.USER_LOGIN}`;

export const USER_PASSWORD = `${process.env.USER_PASSWORD}`;

const prodUrd = "https://anatoly-karpovich.github.io/aqa-course-project/#";
const localUrl = "http://127.0.0.1:5502/index.html#";
export const SALES_PORTAL_URL = process.env.LOCAL ? localUrl : prodUrd;

const localBackendUrl = "http://localhost:5000";
const prodBackendUrl = "https://aqa-course-project.app/";

export const SALES_PORTAL_BACKEND_URL = process.env.LOCAL ? localBackendUrl : prodBackendUrl;
