/**
 * Constants and Configuration
 * Using Object.freeze for immutability
 */
const CONFIG = Object.freeze({
    COLORS: Object.freeze({
        PRIMARY: "#2196F3",
        DANGER: "#ff4444",
        WARNING: "#ffbb33",
        SUCCESS: "#00C851",
        DARK: "#121212",
        SURFACE: "#1e1e1e",
        ON_SURFACE: "#ffffff",
        FINISHED: "#888888",
        ROUTE_PALETTE: Object.freeze([
            "#2196F3",
            "#00BCD4",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
        ]),
    }),
    STORAGE: Object.freeze({
        BUCKET: "https://storage.googleapis.com/vigiia.firebasestorage.app/routes/",
        FALLBACK:
            "https://firebasestorage.googleapis.com/v0/b/vigiia.firebasestorage.app/o/routes%2F",
    }),
    MAP: Object.freeze({
        INITIAL_COORDS: [0, 0],
        INITIAL_ZOOM: 2,
        FOCUS_ZOOM: 17,
        TILE_URL:
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        ATTRIBUTION:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }),
});

/**
 * State Management: Observable Store (Observer Pattern & FP)
 */
class RouteStore {
    constructor() {
        this.state = new Map();
        this.listeners = new Set();
    }

    subscribe(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    _notify(action, payload) {
        this.listeners.forEach((fn) => {
            fn(action, payload);
        });
    }

    setRoute(uuid, data) {
        const isUpdate = this.state.has(uuid);
        this.state.set(uuid, {...this.state.get(uuid), ...data});
        this._notify(isUpdate ? "UPDATED" : "ADDED", {
            uuid,
            data: this.state.get(uuid),
        });
    }

    removeRoute(uuid) {
        if (this.state.delete(uuid)) {
            this._notify("REMOVED", {uuid});
        }
    }

    getRoute(uuid) {
        return this.state.get(uuid);
    }

    getAllRoutes() {
        return Array.from(this.state.entries());
    }
}

/**
 * UI Component: Route Item (Functional UI)
 */
const RouteItem = {
    render(uuid, data, color) {
        const status = RouteUI.getStatusInfo(data, color);
        const item = document.createElement("div");
        item.className = `route-item ${status.className}`;
        item.id = `item-${uuid}`;
        item.innerHTML = `
            <div class="route-status-dot" style="background-color: ${status.color}"></div>
            <div class="route-info">
                <div class="route-id">Vehicle ${uuid.substring(0, 8)}</div>
                <div class="route-meta">${status.label}</div>
            </div>
        `;
        return item;
    },

    update(el, data, color) {
        const status = RouteUI.getStatusInfo(data, color);
        el.className = `route-item ${status.className}`;
        el.querySelector(".route-status-dot").style.backgroundColor =
            status.color;
        el.querySelector(".route-meta").textContent = status.label;
    },
};

/**
 * Service: Map Manager (SRP - Handles Map Operations)
 */
class MapManager {
    constructor(elementId) {
        this.map = L.map(elementId, {
            zoomControl: false,
            tap: false,
            closePopupOnClick: false,
            preferCanvas: true,
            maxZoom: 20,
        }).setView(CONFIG.MAP.INITIAL_COORDS, CONFIG.MAP.INITIAL_ZOOM);

        this.markerCluster = L.markerClusterGroup({
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 16,
            chunkedLoading: true,
        }).addTo(this.map);

        L.tileLayer(CONFIG.MAP.TILE_URL, {
            attribution: CONFIG.MAP.ATTRIBUTION,
            subdomains: "abcd",
            maxZoom: 20,
        }).addTo(this.map);

        L.control.zoom({position: "topright"}).addTo(this.map);
        this.setupResize();
    }

    setupResize() {
        window.addEventListener("resize", () => {
            setTimeout(() => this.map.invalidateSize(), 200);
        });
    }

    flyTo(latlng, zoom = CONFIG.MAP.FOCUS_ZOOM) {
        this.map.flyTo(latlng, zoom, {animate: true, duration: 2.0});
    }

    fitBounds(
        bounds,
        options = {padding: [50, 50], maxZoom: 15, animate: true}
    ) {
        this.map.fitBounds(bounds, options);
    }

    getCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.flyTo(
                    [position.coords.latitude, position.coords.longitude],
                    14
                );
            });
        }
    }
}

/**
 * Service: Route UI Component (Template Pattern & SRP)
 */
const RouteUI = {
    createItem(data, uuid, color) {
        const item = document.createElement("div");
        const status = this.getStatusInfo(data, color);

        item.className = `route-item ${status.className}`;
        item.id = `item-${uuid}`;
        item.innerHTML = `
      <div class="route-status-dot" style="background-color: ${status.color}"></div>
      <div class="route-info">
        <div class="route-id">Vehicle ${uuid.substring(0, 8)}</div>
        <div class="route-meta">${status.label}</div>
      </div>
    `;
        return item;
    },

    getStatusInfo(data, defaultColor) {
        if (data.isFinished)
            return {
                color: CONFIG.COLORS.FINISHED,
                label: "🏁 FINISHED",
                className: "finished",
            };
        if (data.isPanic)
            return {
                color: CONFIG.COLORS.DANGER,
                label: "🆘 PANIC",
                className: "panic",
            };
        if (data.isAlert)
            return {
                color: CONFIG.COLORS.WARNING,
                label: "⚠️ ALERT",
                className: "alert",
            };
        return {color: defaultColor, label: "Normal", className: ""};
    },

    getVehicleIcon(angle, color, speed, data) {
        const status = this.getStatusInfo(data, color);
        const speedKph = speed ? Math.round(speed * 3.6) : 0;

        return L.divIcon({
            className: "vehicle-marker-container",
            html: `
        <div class="vehicle-marker ${data.isPanic ? "panic-marker" : ""} ${
            data.isFinished ? "finished-marker" : ""
        }" 
             style="transform: rotate(${angle || 0}deg); ${
                 data.isFinished ? "opacity: 0.5; filter: grayscale(1);" : ""
             }">
           <svg class="vehicle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fill="${
                status.color
            }" stroke="#fff" stroke-width="1.5"/>
           </svg>
        </div>
        ${
            speedKph > 5 && !data.isFinished
                ? `<div class="speed-badge">${speedKph} km/h</div>`
                : ""
        }
      `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        });
    },
};

/**
 * Service: Data Manager (Handles Fetching & State)
 */
class RouteDataManager {
    async fetchRouteHistory(uuid) {
        try {
            const url = `${CONFIG.STORAGE.BUCKET}${uuid}.json`;
            let response = await fetch(url);

            if (!response.ok) {
                const fallback = `${CONFIG.STORAGE.FALLBACK}${uuid}.json?alt=media`;
                response = await fetch(fallback);
            }

            if (!response.ok) throw new Error("Data fetch failed");
            return await response.json();
        } catch (err) {
            console.error("Error fetching route data:", err);
            return null;
        }
    }
}

/**
 * Controller: Application Orchestrator (Observer Pattern)
 */
class RouteMonitorApp {
    constructor() {
        this.store = new RouteStore();
        this.mapMgr = new MapManager("map");
        this.dataMgr = new RouteDataManager();

        this.components = new Map(); // uuid -> { polyline, marker, el, color }
        this.colorIndex = 0;

        this.init();
    }

    init() {
        const statusEl = document.getElementById("status");
        const routeListEl = document.getElementById("route-list");
        const searchInput = document.getElementById("route-search");

        this.mapMgr.getCurrentPosition();
        this.store.subscribe((action, payload) =>
            this.handleStateChange(action, payload, routeListEl, statusEl)
        );

        searchInput?.addEventListener("input", (e) =>
            this.handleSearch(e.target.value, routeListEl)
        );
        this.setupFirebase(statusEl);
    }

    handleSearch(query, listEl) {
        const term = query.toLowerCase();
        Array.from(listEl.querySelectorAll(".route-item")).forEach((el) => {
            const id = el.querySelector(".route-id").textContent.toLowerCase();
            el.style.display = id.includes(term) ? "flex" : "none";
        });
        this.sortList(listEl); // Re-run to handle group visibility
    }

    setupFirebase(statusEl) {
        const db = firebase.firestore();
        // const recentThreshold = new Date();
        // recentThreshold.setHours(recentThreshold.getHours() - 24);

        db.collection("routes")
            // .where("createdAt", ">", recentThreshold)
            .orderBy("createdAt", "desc")
            .limit(500)
            .onSnapshot(
                (snapshot) => {
                    statusEl.textContent = snapshot.empty
                        ? "No active routes."
                        : `Tracking ${snapshot.size} routes...`;
                    snapshot.docChanges().forEach(({type, doc}) => {
                        const uuid = doc.id;
                        const data = doc.data();
                        if (type === "removed") this.store.removeRoute(uuid);
                        else this.store.setRoute(uuid, data);
                    });
                },
                (err) => {
                    statusEl.textContent = "Connection Error";
                    console.error(err);
                }
            );
    }

    async handleStateChange(action, {uuid, data}, listEl, statusEl) {
        switch (action) {
            case "ADDED":
                await this.renderRoute(uuid, data, listEl);
                break;
            case "UPDATED":
                this.updateRouteComponents(uuid, data);
                break;
            case "REMOVED":
                this.removeRouteComponents(uuid);
                break;
        }
        this.sortList(listEl);
    }

    async renderRoute(uuid, data, listEl) {
        if (this.components.has(uuid)) return;

        const routeHistory = await this.dataMgr.fetchRouteHistory(uuid);
        if (!routeHistory?.coordinates) return;

        const color =
            CONFIG.COLORS.ROUTE_PALETTE[
                this.colorIndex++ % CONFIG.COLORS.ROUTE_PALETTE.length
            ];
        const status = RouteUI.getStatusInfo(data, color);

        // Map Layers
        const polyline = L.polyline(
            routeHistory.coordinates.map((c) => [c.latitude, c.longitude]),
            {
                color: status.color,
                weight: data.isPanic ? 10 : data.isAlert ? 6 : 3,
                opacity: data.isFinished ? 0.3 : 0.8,
                dashArray: data.isFinished
                    ? "5, 5"
                    : data.isPanic
                      ? ""
                      : "1, 10",
                zIndexOffset: data.isPanic ? 2000 : data.isAlert ? 1000 : 0,
            }
        ).addTo(this.mapMgr.map);

        if (data.isPanic || data.isAlert) {
            polyline.bringToFront();
        }

        let marker = null;
        if (data.coordinate) {
            marker = L.marker(
                [data.coordinate.latitude, data.coordinate.longitude],
                {
                    icon: RouteUI.getVehicleIcon(
                        data.coordinate.heading,
                        color,
                        data.coordinate.speed,
                        data
                    ),
                    zIndexOffset: data.isPanic ? 5000 : data.isAlert ? 3000 : 0,
                }
            );

            // Panic vehicles are too important to be clustered
            if (data.isPanic) {
                marker.addTo(this.mapMgr.map);
            } else {
                this.mapMgr.markerCluster.addLayer(marker);
            }

            this.setupPopup(marker, uuid, data);
            if (data.isPanic) marker.openPopup();
        }

        // UI Element
        const el = RouteItem.render(uuid, data, color);
        el.onclick = () => this.focusRoute(uuid);
        listEl.insertBefore(el, listEl.firstChild);

        const routeObj = {polyline, marker, el, color};
        this.components.set(uuid, routeObj);
        this._attachInteractions(uuid, routeObj);
    }

    updateRouteComponents(uuid, data) {
        const comp = this.components.get(uuid);
        if (!comp) return;

        const {marker, polyline, el, color} = comp;

        if (data.coordinate && marker) {
            marker.setLatLng([
                data.coordinate.latitude,
                data.coordinate.longitude,
            ]);
            marker.setIcon(
                RouteUI.getVehicleIcon(
                    data.coordinate.heading,
                    color,
                    data.coordinate.speed,
                    data
                )
            );

            // Adjust marker layer membership based on status
            if (data.isPanic && this.mapMgr.markerCluster.hasLayer(marker)) {
                this.mapMgr.markerCluster.removeLayer(marker);
                marker.addTo(this.mapMgr.map);
            } else if (
                !data.isPanic &&
                !this.mapMgr.markerCluster.hasLayer(marker)
            ) {
                this.mapMgr.map.removeLayer(marker);
                this.mapMgr.markerCluster.addLayer(marker);
            }

            marker.setZIndexOffset(
                data.isPanic ? 5000 : data.isAlert ? 3000 : 0
            );
            if (data.isPanic || data.isAlert) {
                marker.openPopup();
            }
        }

        if (polyline) {
            const status = RouteUI.getStatusInfo(data, color);
            polyline.setStyle({
                color: status.color,
                weight: data.isPanic ? 10 : data.isAlert ? 6 : 3,
                opacity: data.isFinished ? 0.3 : 0.8,
                dashArray: data.isFinished
                    ? "5, 5"
                    : data.isPanic
                      ? ""
                      : "1, 10",
            });
            if (data.isPanic || data.isAlert) polyline.bringToFront();
        }

        RouteItem.update(el, data, color);
    }

    removeRouteComponents(uuid) {
        const comp = this.components.get(uuid);
        if (comp) {
            if (comp.polyline) this.mapMgr.map.removeLayer(comp.polyline);
            if (comp.marker) {
                this.mapMgr.markerCluster.removeLayer(comp.marker);
                this.mapMgr.map.removeLayer(comp.marker);
            }
            comp.el.remove();
            this.components.delete(uuid);
        }
    }

    focusRoute(uuid) {
        const comp = this.components.get(uuid);
        if (comp?.marker) {
            this.mapMgr.flyTo(comp.marker.getLatLng());
            this._toggleRouteHighlight(uuid, true);
            setTimeout(() => this._toggleRouteHighlight(uuid, false), 5000);
        }
    }

    _toggleRouteHighlight(uuid, isHighlighted) {
        const comp = this.components.get(uuid);
        const data = this.store.getRoute(uuid);
        if (!comp || !data) return;

        const {polyline, marker, el, color} = comp;

        if (polyline) {
            const isUrgent = data.isPanic || data.isAlert;
            polyline.setStyle({
                weight: isHighlighted ? (isUrgent ? 10 : 7) : isUrgent ? 6 : 3,
                opacity: isHighlighted ? 1 : data.isFinished ? 0.3 : 0.8,
            });
            if (isHighlighted) polyline.bringToFront();
        }

        if (marker) {
            if (isHighlighted) {
                const icon = marker.options.icon;
                const html = icon.options.html.replace(
                    "vehicle-marker",
                    "vehicle-marker hovered"
                );
                marker.setIcon(L.divIcon({...icon.options, html}));
                marker.setZIndexOffset(1000);
            } else {
                marker.setIcon(
                    RouteUI.getVehicleIcon(
                        data.coordinate.heading,
                        color,
                        data.coordinate.speed,
                        data
                    )
                );
                marker.setZIndexOffset(0);
            }
        }

        if (el) el.classList.toggle("highlighted", isHighlighted);
    }

    _attachInteractions(uuid, comp) {
        [comp.marker, comp.polyline].filter(Boolean).forEach((layer) => {
            layer.on("mouseover", () => this._toggleRouteHighlight(uuid, true));
            layer.on("mouseout", () => this._toggleRouteHighlight(uuid, false));
            layer.on("click", () => this.focusRoute(uuid));
        });
    }

    setupPopup(marker, uuid, data) {
        marker.bindPopup(
            `
            <div class="popup-content">
                <h3>Vehicle ID: ${uuid.substring(0, 8)}</h3>
                <p><b>Status:</b> ${RouteUI.getStatusInfo(data, "").label}</p>
                <p><b>Updated:</b> ${new Date().toLocaleTimeString()}</p>
            </div>
        `,
            {autoClose: true, autoPan: false}
        );
    }

    sortList(listEl) {
        const items = Array.from(listEl.querySelectorAll(".route-item"));

        // Define groups
        const groups = [
            {
                id: "group-panic",
                label: "🆘 Critical Panic",
                weight: 0,
                class: "panic",
            },
            {
                id: "group-alert",
                label: "⚠️ Active Alerts",
                weight: 1,
                class: "alert",
            },
            {
                id: "group-normal",
                label: "📡 Normal Operation",
                weight: 2,
                class: "",
            },
            {
                id: "group-finished",
                label: "🏁 Finished",
                weight: 3,
                class: "finished",
            },
        ];

        // Ensure group containers exist
        groups.forEach((group) => {
            let groupEl = listEl.querySelector(`#${group.id}`);
            if (!groupEl) {
                groupEl = document.createElement("div");
                groupEl.id = group.id;
                groupEl.className = "route-group";
                groupEl.innerHTML = `
                    <div class="route-group-header">${group.label}</div>
                    <div class="group-content"></div>
                `;
                listEl.appendChild(groupEl);
            }
        });

        // Helper to get group for an item
        const getGroupForEl = (el) => {
            if (el.classList.contains("panic")) return "group-panic";
            if (el.classList.contains("alert")) return "group-alert";
            if (el.classList.contains("finished")) return "group-finished";
            return "group-normal";
        };

        // Move items to their respective groups
        items.forEach((item) => {
            const targetGroupId = getGroupForEl(item);
            const content = listEl.querySelector(
                `#${targetGroupId} .group-content`
            );
            if (content && item.parentElement !== content) {
                content.appendChild(item);
            }
        });

        // Hide/Show groups based on content and sort groups
        const groupElements = Array.from(
            listEl.querySelectorAll(".route-group")
        );
        groupElements
            .sort((a, b) => {
                const weightA = groups.find((g) => g.id === a.id).weight;
                const weightB = groups.find((g) => g.id === b.id).weight;
                return weightA - weightB;
            })
            .forEach((groupEl) => {
                const content = groupEl.querySelector(".group-content");
                const hasVisibleItems = Array.from(content.children).some(
                    (child) => child.style.display !== "none"
                );
                groupEl.style.display = hasVisibleItems ? "block" : "none";
                listEl.appendChild(groupEl);
            });
    }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
    if (typeof firebase !== "undefined" && typeof L !== "undefined") {
        window.vigiiaApp = new RouteMonitorApp();
    }
});
