import {useAtomValue, useSetAtom} from "jotai";
import {Fragment, useEffect, useRef, useState} from "react";
import {Keyboard, TouchableOpacity, View, type ViewProps} from "react-native";
import {Button} from "@/components/Button/Button";
import {Divider} from "@/components/Divider/Divider";
import {Icon} from "@/components/Icon/Icon";
import {Input} from "@/components/Input/Input";
import {ListItem} from "@/components/ListItem/ListItem";
import {Spinner} from "@/components/Spinner/Spinner";
import {Text} from "@/components/Text/Text";
import {STRINGS} from "@/constants/strings";
import {useDebounce} from "@/hooks/useDebounce";
import {
    type AddressSuggestion,
    getLocationDetail,
    searchAddresses,
} from "@/services/address";
import type {Coordinate} from "@/stores/location";
import {destainAtom, originAtom} from "@/stores/route";
import {RADIUS} from "@/theme/border";
import {theme} from "@/theme/colors";
import {SPACING} from "@/theme/spacing";
import {styles} from "./DestinationCard.styles";

export type DestinationCardProps = ViewProps & {
    onPressAction?: () => void;
    onDestinationSelect?: (coordinate: Coordinate) => void;
};

export const DestinationCard = ({
    onPressAction,
    onDestinationSelect,
    style,
    ...props
}: DestinationCardProps) => {
    const {background, text} = theme();
    const setDestain = useSetAtom(destainAtom);
    const destain = useAtomValue(destainAtom);
    const origin = useAtomValue(originAtom);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);
    const isAutoSelecting = useRef(false);

    const DEBOUNCE_DELAY = 800;
    const debouncedDestain = useDebounce(destain, DEBOUNCE_DELAY);
    const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

    useEffect(() => {
        if (isAutoSelecting.current) {
            return;
        }

        const fetchDetails = async () => {
            if (!debouncedDestain) {
                return;
            }
            try {
                const label = await getLocationDetail(debouncedDestain);
                if (label && label !== query) {
                    isAutoSelecting.current = true;
                    setQuery(label);
                }
            } catch (error) {
                console.error("Failed to fetch location details", error);
            }
        };

        fetchDetails();
    }, [debouncedDestain, query]);

    useEffect(() => {
        if (isAutoSelecting.current) {
            isAutoSelecting.current = false;
            return;
        }

        const trimmedQuery = debouncedQuery.trim();

        if (trimmedQuery.length < 3) {
            setSuggestions([]);
            setIsLoading(false);
            setHasAttemptedSearch(false);
            return;
        }

        const performSearch = async () => {
            setIsLoading(true);
            try {
                const addresses = await searchAddresses(trimmedQuery, origin);
                setSuggestions(addresses);
            } catch {
                setSuggestions([]);
            } finally {
                setIsLoading(false);
                setHasAttemptedSearch(true);
            }
        };

        performSearch();
    }, [debouncedQuery, origin]);

    const onSuggestionPress = (suggestion: AddressSuggestion) => {
        isAutoSelecting.current = true;
        setQuery(suggestion.label);
        setSuggestions([]);
        setHasAttemptedSearch(false);
        const coordinate = {
            latitude: suggestion.coordinate.latitude,
            longitude: suggestion.coordinate.longitude,
            name: suggestion.label,
            distance: 0,
        };
        setDestain(coordinate);
        onDestinationSelect?.(coordinate);
        Keyboard.dismiss();
    };

    const onClear = () => {
        setQuery("");
        setSuggestions([]);
        setHasAttemptedSearch(false);
    };

    return (
        <View
            {...props}
            style={[styles.container, {backgroundColor: background}, style]}
        >
            <Input
                placeholder={STRINGS.home.destination_placeholder}
                leftIcon="circle"
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                containerStyle={{marginBottom: 0}}
                rightIcon={
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: SPACING[2],
                        }}
                    >
                        {isLoading && <Spinner size="small" />}
                        {query.length > 0 && (
                            <TouchableOpacity onPress={onClear} hitSlop={10}>
                                <Icon
                                    name="close-circle"
                                    size={20}
                                    color={`${text}40`}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            {(suggestions.length > 0 ||
                (hasAttemptedSearch && query.length >= 3 && !isLoading)) && (
                <View
                    style={[
                        styles.suggestionsContainer,
                        {
                            backgroundColor: background,
                            borderRadius: RADIUS[7],
                            paddingVertical: SPACING[1],
                        },
                    ]}
                >
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <Fragment key={suggestion.id}>
                                <ListItem
                                    title={suggestion.label}
                                    onPress={() =>
                                        onSuggestionPress(suggestion)
                                    }
                                    style={{paddingVertical: SPACING[4]}}
                                />
                                {index < suggestions.length - 1 && (
                                    <Divider
                                        spacing={false}
                                        style={{
                                            marginHorizontal: SPACING[4],
                                            opacity: 0.1,
                                        }}
                                    />
                                )}
                            </Fragment>
                        ))
                    ) : (
                        <View
                            style={{padding: SPACING[6], alignItems: "center"}}
                        >
                            <Icon
                                name="alert-circle-outline"
                                size={24}
                                color={`${text}40`}
                                style={{marginBottom: SPACING[2]}}
                            />
                            <Text
                                type="caption"
                                style={{
                                    color: `${text}60`,
                                    textAlign: "center",
                                }}
                            >
                                No se encontraron resultados para "{query}"
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <Button
                title={STRINGS.home.action_label}
                icon="shield-outline"
                onPress={onPressAction}
            />
        </View>
    );
};
