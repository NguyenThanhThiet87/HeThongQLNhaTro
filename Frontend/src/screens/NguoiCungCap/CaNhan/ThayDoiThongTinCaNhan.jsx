import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    Image, ScrollView, SafeAreaView, StatusBar,
    KeyboardAvoidingView, Platform, Switch,
    Dimensions, Modal, ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { useEditProviderProfile } from '../../../hooks/user/useUserProviderProfile';

import InputGroup from '../../../components/InputGroup';
import AppHeader from '../../../components/AppHeader';
import RadioButton from '../../../components/RadioButton';
import InputCalendar from '../../../components/InputCalendar';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../../../components/LoadingOverlay';
import toast from '../../../utils/toast';

const { width, height } = Dimensions.get('window');

const ThayDoiThongTinCaNhan = ({ route }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);
    const navigation = useNavigation();

    const {
        loading: loadingProfile,
        maNcc, setMaNcc,
        avatar, setAvatar,
        fullName, setFullName,
        ngaySinh, setNgaySinh,
        idCard, setIdCard,
        soDienThoai,
        address, setAddress,
        gioiTinh, setGioiTinh,
        moTaDv, setMoTaDv,
        khuVucPv, setKhuVucPv,
        sanSang, setSanSang,
        handleSaveChanges
    } = useEditProviderProfile(route.params.maNd, navigation);

    const [formErrors, setFormErrors] = useState({});
    const [mapModalVisible, setMapModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [tempLocation, setTempLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const mapRef = useRef(null);

    const defaultRegion = {
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const requestLocationPermission = async () => {
        try {
            setLoadingLocation(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                toast.error("Vui lòng cấp quyền truy cập vị trí!");
                setLoadingLocation(false);
                setMapModalVisible(true);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const currentPos = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setSelectedLocation(currentPos);
            setTempLocation(currentPos);
            setMapModalVisible(true);
        } catch (error) {
            console.error("Lỗi định vị:", error);
            setMapModalVisible(true);
        } finally {
            setLoadingLocation(false);
        }
    };

    const confirmLocation = async () => {
        if (!tempLocation) return;
        
        try {
            setLoadingLocation(true);
            const [geo] = await Location.reverseGeocodeAsync({
                latitude: tempLocation.latitude,
                longitude: tempLocation.longitude
            });
            
            if (geo) {
                const addressStr = `${geo.streetNumber ? geo.streetNumber + ' ' : ''}${geo.street ? geo.street + ', ' : ''}${geo.district ? geo.district + ', ' : ''}${geo.city || geo.subregion || ''}`;
                setKhuVucPv(addressStr);
            }
            setSelectedLocation(tempLocation);
            setMapModalVisible(false);
        } catch (error) {
            console.error("Lỗi lấy địa chỉ:", error);
            setSelectedLocation(tempLocation);
            setMapModalVisible(false);
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bgLight }]}>
            <StatusBar barStyle="dark-content" />
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Thay Đổi Thông Tin</Text>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.profilePicSection}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: avatar || 'https://i.pravatar.cc/300' }}
                                style={[styles.avatar, { borderColor: COLORS.primary + '33' }]}
                            />
                            <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
                                <MaterialIcons name="photo-camera" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.changePhotoText}>THAY ĐỔI ẢNH ĐẠI DIỆN</Text>
                    </View>

                    <View style={styles.form}>
                        <InputGroup
                            label="Tên Cửa Hàng"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Nhập tên..."
                            error={formErrors.fullName}
                            iconName="store"
                        />

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <View style={styles.rowInput}>
                                <View style={[styles.input, styles.readonlyInput, { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, flex: 1 }]}>
                                    <Text style={{ color: COLORS.inputText }}>{soDienThoai || 'Chưa cập nhật'}</Text>
                                    <MaterialIcons name="lock" size={18} color={COLORS.inputText} />
                                </View>
                                <TouchableOpacity style={styles.changeBtn} onPress={() => navigation.navigate("ThayDoiSoDienThoai")}>
                                    <Text style={styles.changeBtnText}>Thay đổi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.label}>GIỚI TÍNH</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                            <RadioButton
                                checked={gioiTinh == 1}
                                onPress={() => setGioiTinh(1)}
                                text="Nam"
                            />
                            <RadioButton
                                checked={gioiTinh === 0}
                                onPress={() => setGioiTinh(0)}
                                text="Nữ"
                                style={{ marginLeft: 24 }}
                            />
                        </View>

                        <InputCalendar
                            value={ngaySinh || ""}
                            onChange={setNgaySinh}
                            label="NGÀY SINH"
                            maximumDate={new Date()}
                        />

                        <InputGroup
                            label="Số CCCD"
                            value={idCard || ""}
                            onChangeText={setIdCard}
                            placeholder="Nhập số CCCD..."
                            error={formErrors.idCard}
                            iconName="badge"
                        />

                        <InputGroup
                            label="Mô tả dịch vụ kinh doanh"
                            value={moTaDv || ""}
                            onChangeText={setMoTaDv}
                            placeholder="Ví dụ: Cung cấp gas, nước khoáng..."
                            iconName="description"
                            multiline
                            numberOfLines={4}
                        />

                        {/* Map Integration */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Khu vực / Địa chỉ phục vụ</Text>
                            <View style={styles.mapContainer}>
                                <View style={styles.addressInputRow}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, borderBottomRightRadius: 0, borderTopRightRadius: 0 }]}
                                        value={khuVucPv}
                                        onChangeText={setKhuVucPv}
                                        placeholder="Ghim vị trí trên bản đồ..."
                                    />
                                    <TouchableOpacity style={styles.mapActionBtn} onPress={requestLocationPermission} disabled={loadingLocation}>
                                        {loadingLocation ? <ActivityIndicator size="small" color={COLORS.primary} /> : <MaterialIcons name="my-location" size={24} color={COLORS.primary} />}
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableOpacity style={styles.mapPreview} onPress={requestLocationPermission}>
                                    {!selectedLocation ? (
                                        <View style={styles.emptyMap}>
                                            <MaterialIcons name="map" size={40} color={COLORS.textSecondary} />
                                            <Text style={styles.mapOverlayText}>Chạm để ghim vị trí</Text>
                                        </View>
                                    ) : (
                                        <MapView
                                            style={styles.mapViewInline}
                                            region={selectedLocation}
                                            scrollEnabled={false}
                                            zoomEnabled={false}
                                            pitchEnabled={false}
                                            rotateEnabled={false}
                                            onPress={requestLocationPermission}
                                        >
                                            <Marker coordinate={selectedLocation} />
                                        </MapView>
                                    )}
                                </TouchableOpacity>
                                <Text style={styles.hint}>Vị trí ghim trên bản đồ giúp khách hàng xung quanh dễ dàng nhìn thấy bạn.</Text>
                            </View>
                        </View>

                        <View style={styles.switchRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Trạng thái phục vụ</Text>
                                <Text style={styles.switchDesc}>Bật để cho khách hàng biết bạn đang sẵn sàng</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#cbd5e1', true: COLORS.primary }}
                                thumbColor="white"
                                onValueChange={setSanSang}
                                value={sanSang}
                            />
                        </View>

                    </View>
                    <View style={{ height: 120 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal MAP Selection */}
            <Modal visible={mapModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setMapModalVisible(false)} style={styles.modalCloseBtn}>
                            <MaterialIcons name="close" size={28} color={COLORS.textMain} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Ghim vị trí trên bản đồ</Text>
                        <TouchableOpacity onPress={confirmLocation} style={styles.modalSaveBtn}>
                            <Text style={styles.modalSaveBtnText}>Xong</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <MapView
                        ref={mapRef}
                        style={styles.fullMap}
                        initialRegion={tempLocation || defaultRegion}
                        onRegionChangeComplete={(region) => setTempLocation(region)}
                        provider={PROVIDER_GOOGLE}
                    >
                    </MapView>

                    {/* Static Marker in center for drag effect */}
                    <View style={styles.staticMarkerContainer} pointerEvents="none">
                         <MaterialIcons name="location-on" size={48} color={COLORS.primary} />
                         <View style={styles.markerShadow} />
                    </View>

                    <View style={styles.mapInfo}>
                         <MaterialIcons name="info" size={18} color={COLORS.primary} />
                         <Text style={styles.mapInfoText}>Kéo bản đồ để ghim vị trí chính xác nhất</Text>
                    </View>
                </View>
            </Modal>

            <View style={[styles.footer, { backgroundColor: COLORS.white, borderTopColor: COLORS.border }]}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
                    <MaterialIcons name="save" size={20} color="white" />
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>
            <LoadingOverlay visible={loadingProfile} />
        </SafeAreaView>
    );
};

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },
    scrollContent: { paddingBottom: 20 },
    profilePicSection: { alignItems: 'center', paddingVertical: 24 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3 },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 20,
        elevation: 4,
    },
    changePhotoText: { marginTop: 12, color: COLORS.primary, fontSize: 13, fontWeight: '700' },
    form: { paddingHorizontal: 16, gap: 12 },
    inputGroup: { marginBottom: 12 },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 15,
        backgroundColor: 'white',
        borderColor: COLORS.border
    },
    readonlyInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rowInput: { flexDirection: 'row' },
    changeBtn: {
        marginLeft: 8,
        height: 50,
        paddingHorizontal: 14,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary + '33'
    },
    changeBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
    
    // Map Styles
    mapContainer: { gap: 8 },
    addressInputRow: { flexDirection: 'row' },
    mapActionBtn: {
        width: 50,
        height: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: COLORS.border,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapPreview: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        backgroundColor: '#e2e8f0',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    emptyMap: { alignItems: 'center', gap: 8 },
    mapViewInline: { width: '100%', height: '100%' },
    mapOverlayText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
    hint: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center' },

    // Switch
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginTop: 10
    },
    switchDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

    // Modal
    modalContainer: { flex: 1, backgroundColor: 'white' },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    modalTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
    modalSaveBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    modalSaveBtnText: { color: 'white', fontWeight: '800' },
    fullMap: { flex: 1 },
    staticMarkerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        alignItems: 'center'
    },
    markerShadow: { width: 10, height: 4, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 5, marginTop: -2 },
    mapInfo: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    mapInfoText: { fontSize: 13, fontWeight: '600', color: COLORS.textMain },

    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: 16,
        borderTopWidth: 1,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 8,
    },
    saveBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
});

export default ThayDoiThongTinCaNhan;