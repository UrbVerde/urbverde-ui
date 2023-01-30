export default [
  {
    name: "Home",
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
  {
    name: "About",
    path: "/:id?/urbverde",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "About",
        path: "",
        component: () => import("@/views/UrbverdeView"),
        meta: {},
      },
    ],
  },
  {
    name: "contato",
    path: "/:id?/contato",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "About",
        path: "",
        component: () => import("@/views/ContatoView"),
        meta: {},
      },
    ],
  },
];
