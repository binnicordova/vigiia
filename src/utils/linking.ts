import * as Linking from "expo-linking";

export const call = (phone: string) => {
    Linking.openURL(`tel:+${phone}`);
};

export const whatsapp = (phone: string) => {
    Linking.openURL(`https://wa.me/${phone}`);
};
