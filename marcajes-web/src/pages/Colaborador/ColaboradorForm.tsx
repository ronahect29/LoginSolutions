import { useEffect, useState } from "react";
import "../../styles/Colaborador.css";
import { api } from "../../services/api";
import { useSession } from "../../hooks/useSession";
import { ES_LOCAL } from "../../utils/utils";
import type { Marcaje } from "../../models/marcaje";
import { getCurrentLocation } from "../../utils/geolocation";

export function ColaboradorForm() {
  const { empleado } = useSession();
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [disabledEntrada, setDisabledEntrada] = useState(false);
  const [disabledSalida, setDisabledSalida] = useState(false);

  // Actualizar cada segundo la hora
  useEffect(() => {

    const update = () => {
      const now = new Date();

      const f = now.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const h = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setFecha(f);
      setHora(h);
    };

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);

  }, []);
  useEffect(() => {
    if (!empleado) return;
    const hoy = new Date().toISOString().split("T")[0];
    if (ES_LOCAL) {
      console.log("ColaboradorForm: emplead: ", JSON.stringify(empleado));
    }
    async function fetchMarcajes() {
      const uri = `/marcaje/findByEmpleadoAndFecha/${empleado?.id_empleado}/${hoy}`;
      api.get<Marcaje[]>(uri).then((res) => {
        if (ES_LOCAL) {
          console.log("Marcajes del día:", res.data);
        }
        if (res.data.length > 0) {
          res.data.forEach((m) => {
            if (m.es_entrada) {
              setDisabledEntrada(true);
              setDisabledSalida(false);
            }
            if (!m.es_entrada) {
              setDisabledSalida(true);
            }
          })
        }
      }).catch((err) => {
        console.error("Error al obtener marcajes:", err);
      });
    }
    fetchMarcajes();
  }, [empleado]);

  async function registrarMarcaje(esEntrada: boolean) {
    if (!empleado) return;
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((result) => {
        if (result.state === "denied") {
          alert("Debes habilitar la ubicación en el navegador");
        }
      });
    try {
      const ahora = new Date();
      const horaActual = ahora.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const { latitud, longitud } = await getCurrentLocation();
      await api.post("/marcaje/registrar", {
        empleado: empleado.id_empleado,
        es_entrada: esEntrada,
        hora: horaActual,
        latitud,
        longitud
      });
      if (esEntrada) {
        setDisabledEntrada(true);
        if (!disabledEntrada)
          setDisabledSalida(false);
      }
      alert(esEntrada ? "📥 Entrada registrada" : "📤 Salida registrada");
    } catch (error: any) {
      if (ES_LOCAL) {
        console.log("NO SE PUDO OBTENER LA UBICACIÓN: ", JSON.stringify(error));
      }
      alert(error.mesagge ?? "No se pudo obtener la ubicación");
    }
  }

  function marcarEntrada() {
    registrarMarcaje(true);
  }

  function marcarSalida() {
    registrarMarcaje(false);
  }

  function verEstadisticas() {
    alert("📊 Próximamente: estadísticas del colaborador");
  }

  return (
    <div className="colab-container">
      <div className="colab-card">
        <h1 className="colab-title">Panel del Colaborador</h1>

        <div className="colab-subtitle">Fecha y hora actual</div>

        <div className="colab-timebox">
          <span>📅 {fecha}</span>
          <span>⏰ {hora}</span>
        </div>

        <button disabled={disabledEntrada} onClick={marcarEntrada} className="colab-btn">
          {disabledEntrada ? "Ya ha marcado su entrada para el día de hoy" : "Marcar Entrada"}
        </button>

        <button disabled={disabledSalida} onClick={marcarSalida} className="colab-btn">
          {disabledSalida ? "Ya ha marcado su salida para el día de hoy" : "Marcar Salida"}
        </button>

        <div className="colab-divider"></div>

        <button
          onClick={verEstadisticas}
          className="colab-btn colab-btn-secondary"
        >
          Ver Estadísticas
        </button>
      </div>
    </div>
  );
}
