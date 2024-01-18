require("dotenv").config({ path: "./.env" });

const {
  getAllLibros,
  createLibro,
  updateLibro,
  deleteLibro,
  getLibroById,
} = require("../../src/controllers/libroController");

const libroModel = require("../../src/models/libroModel");

jest.mock("../../src/models/libroModel");

describe("Libro Controller", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("getLibros deberia obtener todos los libros", async () => {
    const mockLibros = [
      { id: 1, titulo: "Libro 1" },
      { id: 2, titulo: "Libro 2" },
    ];

    libroModel.find.mockResolvedValue(mockLibros);

    const mockReq = {};
    await getAllLibros(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibros);
  });

  test("getLibroById deberia obtener un libro", async () => {
    const mockLibro = {
      id: "1",
      titulo: "Libro Encontrado",
      autor: "Juan Perez",
    };

    libroModel.findById.mockResolvedValue(mockLibro);

    const mockReq = { params: { id: 1 } };

    await getLibroById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibro);
  });

  test("createLibro deberia crear un nuevo libro", async () => {
    const mockLibro = { id: "1", titulo: "Nuevo Libro", autor: "Juan Perez" };

    mockLibro.save = () => {};

    libroModel.create.mockResolvedValue(mockLibro);

    const mockReq = { body: mockLibro };

    await createLibro(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibro);
  });

  test("updateLibro deberia actualizar un libro existente", async () => {
    const libroId = "1";
    const libroActualizado = {
      titulo: "Libro Actualizado",
      autor: "Autor Actualizado",
    };
    const libroActualizadoMock = { _id: libroId, ...libroActualizado };

    libroModel.findByIdAndUpdate.mockResolvedValue(libroActualizadoMock);

    const mockReq = { params: { id: "1" }, body: libroActualizado };

    await updateLibro(mockReq, mockRes);

    expect(libroModel.findByIdAndUpdate).toHaveBeenCalledWith(
      libroId,
      libroActualizado,
      { new: true }
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(libroActualizadoMock);
  });

  test("updateLibro deberia devolver un error si el libro no existe", async () => {
    libroModel.findByIdAndUpdate.mockResolvedValue(null);

    const mockReq = {
      params: { id: "99" },
      body: { titulo: "libro actualizado" },
    };

    await updateLibro(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Libro no encontrado" });
  });

  test("deleteLibro deberia eliminar un libro existente", async () => {
    const mockLibroEliminado = {
     params: { id: "123"}
    };

    libroModel.findByIdAndRemove = jest
      .fn()
      .mockResolvedValue(mockLibroEliminado);

    const mockReq = { params: { id: "123" } };

    await deleteLibro(mockReq, mockRes);

    expect(libroModel.findByIdAndRemove).toHaveBeenCalledWith(
      mockReq.params.id
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockLibroEliminado);
  });
});
