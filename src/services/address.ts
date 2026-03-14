import {http} from "@/services/http";
import type {Coordinate} from "@/stores/location";
import {getCurrentLanguage} from "@/utils/localization";

type NominatimAddressResponse = {
    place_id?: number;
    display_name?: string;
    lat?: string;
    lon?: string;
}[];

export type AddressSuggestion = {
    id: string;
    label: string;
    coordinate: Coordinate;
};

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

export async function searchAddresses(
    text: string,
    origin?: Coordinate
): Promise<AddressSuggestion[]> {
    const query = text.trim();

    if (!query) {
        return [];
    }

    let url = `${NOMINATIM_BASE_URL}?format=jsonv2&addressdetails=0&limit=5&q=${encodeURIComponent(query)}`;

    if (origin) {
        url += `&lat=${origin.latitude}&lon=${origin.longitude}`;
    }

    const languageCode = getCurrentLanguage();

    const data = await http.get<NominatimAddressResponse>(url, {
        "Accept-Language": languageCode,
    });

    return data
        .map((item) => {
            const latitude = Number(item.lat);
            const longitude = Number(item.lon);

            if (
                !item.display_name ||
                Number.isNaN(latitude) ||
                Number.isNaN(longitude)
            ) {
                return null;
            }

            return {
                id: String(item.place_id ?? item.display_name),
                label: item.display_name,
                coordinate: {
                    latitude,
                    longitude,
                },
            };
        })
        .filter((item): item is AddressSuggestion => item !== null);
}

export async function getLocationDetail(
    coordinate: Coordinate
): Promise<string> {
    try {
        const {latitude, longitude} = coordinate;
        const url = `${NOMINATIM_REVERSE_URL}?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        const languageCode = getCurrentLanguage();

        const data = await http.get<{display_name?: string}>(url, {
            "Accept-Language": languageCode,
        });

        return data.display_name ?? "";
    } catch (error) {
        console.warn("Failed to fetch location detail", error);
        return `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`;
    }
}
