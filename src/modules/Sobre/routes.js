export default [
  {
    // name: "Home",
    path: "/:id?",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "About",
        path: "/sobre",
        component: () => import("@/views/SobreView"),
        meta: {},
      },
    ],
  },
];
