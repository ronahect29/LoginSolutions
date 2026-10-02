import {
  useEffect,
  useState
} from "react";

import "../../styles/Colaborador.css";

import { useSession } from "../../hooks/useSession";

import type {
  Marcaje,
  ResultadoRegistroMarcaje,
  ValidacionUbicacionMarcaje
} from "../../models/marcaje";

import { api } from "../../services/api";

import {
  getCurrentLocation
} from "../../utils/geolocation";

import {
  ES_LOCAL
} from "../../utils/utils";


// ======================================================
// HELPERS
// ======================================================

function obtenerTipoMarcaje(
  esEntrada: boolean
): string {
  return esEntrada
    ? "Entrada"
    : "Salida";
}


function construirMensajeUbicacion(
  esEntrada: boolean,
  validacion: ValidacionUbicacionMarcaje
): string {
  const tipoMarcaje =
    obtenerTipoMarcaje(
      esEntrada
    );


  // ======================================================
  // DENTRO DEL RANGO
  // ======================================================

  if (
    validacion.estado ===
    "DENTRO_RANGO"
  ) {
    return [
      `✅ ${tipoMarcaje} registrada correctamente.`,
      "",
      validacion.sucursalNombre
        ? `Sucursal: ${validacion.sucursalNombre}`
        : null,
      validacion.distanciaMetros !== null
        ? `Distancia detectada: ${validacion.distanciaMetros} m`
        : null,
      validacion.radioPermitidoMetros !== null
        ? `Radio permitido: ${validacion.radioPermitidoMetros} m`
        : null,
      "",
      "Ubicación dentro del área autorizada."
    ]
      .filter(
        (linea): linea is string =>
          linea !== null
      )
      .join("\n");
  }


  // ======================================================
  // FUERA DEL RANGO
  // ======================================================

  if (
    validacion.estado ===
    "FUERA_RANGO"
  ) {
    return [
      `⚠️ ${tipoMarcaje} registrada fuera del área autorizada.`,
      "",
      validacion.sucursalNombre
        ? `Sucursal: ${validacion.sucursalNombre}`
        : null,
      validacion.distanciaMetros !== null
        ? `Distancia detectada: ${validacion.distanciaMetros} m`
        : null,
      validacion.radioPermitidoMetros !== null
        ? `Radio permitido: ${validacion.radioPermitidoMetros} m`
        : null,
      "",
      "El marcaje fue registrado y quedó identificado para revisión."
    ]
      .filter(
        (linea): linea is string =>
          linea !== null
      )
      .join("\n");
  }


  // ======================================================
  // SIN SUCURSAL
  // ======================================================

  if (
    validacion.estado ===
    "SIN_SUCURSAL"
  ) {
    return [
      `⚠️ ${tipoMarcaje} registrada.`,
      "",
      "No tienes una sucursal asignada.",
      "No fue posible validar la distancia del marcaje."
    ].join("\n");
  }


  // ======================================================
  // SUCURSAL SIN UBICACIÓN
  // ======================================================

  return [
    `⚠️ ${tipoMarcaje} registrada.`,
    "",
    validacion.sucursalNombre
      ? `Sucursal: ${validacion.sucursalNombre}`
      : null,
    "La sucursal no tiene una ubicación configurada.",
    "No fue posible validar la distancia del marcaje."
  ]
    .filter(
      (linea): linea is string =>
        linea !== null
    )
    .join("\n");
}


// ======================================================
// COMPONENTE
// ======================================================

export function ColaboradorForm() {
  const {
    empleado
  } = useSession();


  const [
    fecha,
    setFecha
  ] = useState("");


  const [
    hora,
    setHora
  ] = useState("");


  const [
    disabledEntrada,
    setDisabledEntrada
  ] = useState(false);


  const [
    disabledSalida,
    setDisabledSalida
  ] = useState(false);


  const [
    registrando,
    setRegistrando
  ] = useState(false);


  // ======================================================
  // FECHA Y HORA
  // ======================================================

  useEffect(() => {
    const update =
      () => {
        const now =
          new Date();


        const f =
          now.toLocaleDateString(
            "es-ES",
            {
              weekday:
                "long",
              year:
                "numeric",
              month:
                "long",
              day:
                "numeric"
            }
          );


        const h =
          now.toLocaleTimeString(
            "es-ES",
            {
              hour:
                "2-digit",
              minute:
                "2-digit",
              second:
                "2-digit"
            }
          );


        setFecha(
          f
        );

        setHora(
          h
        );
      };


    update();


    const timer =
      setInterval(
        update,
        1000
      );


    return () =>
      clearInterval(
        timer
      );
  }, []);


  // ======================================================
  // CONSULTAR MARCAJES DEL DÍA
  // ======================================================

  useEffect(() => {
    if (
      !empleado
    ) {
      return;
    }


    const hoy =
      new Date()
        .toISOString()
        .split("T")[0];


    if (
      ES_LOCAL
    ) {
      console.log(
        "ColaboradorForm: empleado:",
        JSON.stringify(
          empleado
        )
      );
    }


    async function fetchMarcajes() {
      const uri =
        `/marcaje/findByEmpleadoAndFecha/${empleado?.id_empleado}/${hoy}`;


      try {
        const res =
          await api.get<Marcaje[]>(
            uri
          );


        if (
          ES_LOCAL
        ) {
          console.log(
            "Marcajes del día:",
            res.data
          );
        }


        const tieneEntrada =
          res.data.some(
            (marcaje) =>
              marcaje.es_entrada
          );


        const tieneSalida =
          res.data.some(
            (marcaje) =>
              !marcaje.es_entrada
          );


        setDisabledEntrada(
          tieneEntrada
        );

        setDisabledSalida(
          !tieneEntrada ||
          tieneSalida
        );
      } catch (
        error
      ) {
        console.error(
          "Error al obtener marcajes:",
          error
        );
      }
    }


    fetchMarcajes();
  }, [
    empleado
  ]);


  // ======================================================
  // REGISTRAR MARCAJE
  // ======================================================

  async function registrarMarcaje(
    esEntrada: boolean
  ) {
    if (
      !empleado ||
      registrando
    ) {
      return;
    }


    try {
      setRegistrando(
        true
      );


      // ======================================================
      // VALIDAR PERMISO GPS
      // ======================================================

      if (
        "permissions" in navigator
      ) {
        const permiso =
          await navigator.permissions
            .query({
              name:
                "geolocation" as PermissionName
            });


        if (
          permiso.state ===
          "denied"
        ) {
          alert(
            "Debes habilitar la ubicación en el navegador para registrar tu marcaje."
          );

          return;
        }
      }


      // ======================================================
      // OBTENER HORA Y GPS
      // ======================================================

      const ahora =
        new Date();


      const horaActual =
        ahora.toLocaleTimeString(
          "es-ES",
          {
            hour:
              "2-digit",
            minute:
              "2-digit",
            second:
              "2-digit"
          }
        );


      const {
        latitud,
        longitud
      } =
        await getCurrentLocation();


      // ======================================================
      // ENVIAR MARCAJE
      // ======================================================

      const response =
        await api.post<ResultadoRegistroMarcaje>(
          "/marcaje/registrar",
          {
            empleado:
              empleado.id_empleado,

            es_entrada:
              esEntrada,

            hora:
              horaActual,

            latitud,

            longitud
          }
        );


      // ======================================================
      // ACTUALIZAR BOTONES
      // ======================================================

      if (
        esEntrada
      ) {
        setDisabledEntrada(
          true
        );

        setDisabledSalida(
          false
        );
      } else {
        setDisabledSalida(
          true
        );
      }


      // ======================================================
      // MOSTRAR RESULTADO
      // ======================================================

      alert(
        construirMensajeUbicacion(
          esEntrada,
          response.data
            .validacionUbicacion
        )
      );
    } catch (
      error: any
    ) {
      if (
        ES_LOCAL
      ) {
        console.error(
          "Error registrando marcaje:",
          error
        );
      }


      const mensaje =
        error?.response?.data?.message ??
        error?.message ??
        "No se pudo registrar el marcaje.";


      alert(
        mensaje
      );
    } finally {
      setRegistrando(
        false
      );
    }
  }


  // ======================================================
  // ACCIONES
  // ======================================================

  function marcarEntrada() {
    registrarMarcaje(
      true
    );
  }


  function marcarSalida() {
    registrarMarcaje(
      false
    );
  }


  function verEstadisticas() {
    alert(
      "📊 Próximamente: estadísticas del colaborador"
    );
  }


  // ======================================================
  // VISTA
  // ======================================================

  return (
    <div className="colab-container">
      <div className="colab-card">
        <h1 className="colab-title">
          Panel del Colaborador
        </h1>


        <div className="colab-subtitle">
          Fecha y hora actual
        </div>


        <div className="colab-timebox">
          <span>
            📅 {fecha}
          </span>

          <span>
            ⏰ {hora}
          </span>
        </div>


        <button
          disabled={
            disabledEntrada ||
            registrando
          }
          onClick={
            marcarEntrada
          }
          className="colab-btn"
        >
          {
            registrando
              ? "Registrando..."
              : disabledEntrada
                ? "Ya ha marcado su entrada para el día de hoy"
                : "Marcar Entrada"
          }
        </button>


        <button
          disabled={
            disabledSalida ||
            registrando
          }
          onClick={
            marcarSalida
          }
          className="colab-btn"
        >
          {
            registrando
              ? "Registrando..."
              : disabledSalida
                ? "Marcar Salida"
                : "Marcar Salida"
          }
        </button>


        <div className="colab-divider" />


        <button
          onClick={
            verEstadisticas
          }
          className="colab-btn colab-btn-secondary"
        >
          Ver Estadísticas
        </button>
      </div>
    </div>
  );
}