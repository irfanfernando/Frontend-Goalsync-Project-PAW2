import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                index: true,
                lazy: {
                    Component: async() => {
                        const component: any = await import("../pages/auth/SignIn/SignIn.tsx");
                        return component.default;
                    }
                }
            },

            {
                path: "signin",
                lazy: {
                    Component: async () => {
                        const component: any = await import("../pages/auth/SignIn/SignIn.tsx");
                        return component.default;
                    }
                }
            },

            {
                path: "signup",
                lazy: {
                    Component: async () => {
                        const component: any = await import("../pages/auth/SignUp/SignUp.tsx");
                        return component.default;
                    }
                }
            },

        ],
    },

    {
        path: "/app",
        children: [
            {
                index: true,
                lazy: {
                    Component: async () => {
                        const component: any = await import("../pages/goals/GoalList.tsx");
                        return component.default;
                    }
                }
            },

            {
                path: "goals",
                lazy: {
                    Component: async () => {
                        const component: any = await import("../pages/goals/GoalList.tsx");
                        return component.default;
                    }
                }
            },

            {
                path: "goals/add",
                lazy: {
                    Component: async () => {
                        const component: any = await import("../pages/goals/AddGoal.tsx");
                        return component.default;
                    }
                }
            },

            {
                path: "goals/:id",
                lazy: {
                    Component: async () => {
                        const component: any = await import("../pages/goals/GoalDetail.tsx");
                        return component.default;
                    }
                }
            },
        ]
    }
]);

export default router;