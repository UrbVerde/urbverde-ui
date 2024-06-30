export default [
  {
    // name: "Home",
    path: "/:id?",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "Home",
        path: "",
        component: () => import("@/views/HomeView"),
        meta: {},
      },
    ],
  },
];
