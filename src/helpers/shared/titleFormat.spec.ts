import { titleFormat } from "./titleFormat";

describe("titleFormat", () => {
  it("debe formatear el texto", () => {
    const res = titleFormat("hola mundo 1");

    expect(res).toBe("Hola Mundo 1");
  });

  it("debe de retornar string vacío si se le pasa un string vacío", () => {
    const res =     titleFormat("");

    expect(res).toBe("");
  });
});
