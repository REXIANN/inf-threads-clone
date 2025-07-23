import "expo-router/entry";

import { createServer, Response, Server } from "miragejs";

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__) {
  // 배포 상태가 아닐 때만 실행
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.post("/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === "kjh" && password === "1234") {
          return {
            accessToken: "access-token",
            refershToken: "refresh-token",
            user: {
              id: "kjh",
              name: "jinhyuck",
              description: "programmer",
              profileImageUrl: "https://github.com/REXIANN",
            },
          };
        }

        return new Response(401, {}, { message: "invalid user" });
      });
    },
  });
}
