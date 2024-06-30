export default [
  {
    // name: "Home",
    path: "/:id?",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "Contato",
        path: "/contato",
        component: () => import("@/views/ContatoView"),
        meta: {},
      },
    ],
  },
];
