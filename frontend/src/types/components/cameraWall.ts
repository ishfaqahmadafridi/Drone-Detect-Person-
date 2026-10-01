import { StreamSourceType } from "../index";

// ==========================================
// 9. Camera Wall & Ground Uplink Wizard Props
// ==========================================
export interface CameraWallModalProps {
  isOpen: boolean;
  activeSource: string;
  onClose: () => void;
  onSelectFeed: (feedType: StreamSourceType, viewMode: "aerial" | "ground") => void;
  onConnectRtsp?: (url: string) => void;
}

export interface CameraWallHeaderProps {
  onClose: () => void;
}

export interface AerialFeedCardProps {
  isActive: boolean;
  onSelect: () => void;
}

export type GroundDeviceCategory = "wall_cctv" | "mobile_phone";
export type WallCameraConnectionType = "wired" | "wireless";
export type GroundWizardStep = 1 | 2 | 3 | 4;
export type WiredSubtype = "poe_rtsp" | "usb_direct";
export type WirelessSubtype = "wifi_rtsp" | "ap_direct";

export interface GroundSensorConfigState {
  deviceCategory: GroundDeviceCategory;
  connectionType: WallCameraConnectionType;
  wiredSubtype: WiredSubtype;
  wirelessSubtype: WirelessSubtype;
  host: string;
  port: number;
  streamPath: string;
  username: string;
  password: string;
  transportProtocol: "tcp" | "udp";
  usbDeviceIndex: string;
  phoneAppType: "android_ipwebcam" | "ios_livereport";
}

export interface GroundWizardStepIndicatorProps {
  currentStep: GroundWizardStep;
  maxStepReached: GroundWizardStep;
  onStepClick: (step: GroundWizardStep) => void;
}

export interface GroundStep1DeviceProps {
  selectedDevice: GroundDeviceCategory;
  onSelectDevice: (device: GroundDeviceCategory) => void;
  onNext: () => void;
}

export interface GroundStep2UplinkProps {
  deviceCategory: GroundDeviceCategory;
  connectionType: WallCameraConnectionType;
  wiredSubtype: WiredSubtype;
  wirelessSubtype: WirelessSubtype;
  onChangeConnectionType: (type: WallCameraConnectionType) => void;
  onChangeWiredSubtype: (subtype: WiredSubtype) => void;
  onChangeWirelessSubtype: (subtype: WirelessSubtype) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface GroundStep3FormProps {
  config: GroundSensorConfigState;
  onChangeField: <K extends keyof GroundSensorConfigState>(
    field: K,
    value: GroundSensorConfigState[K]
  ) => void;
  onApplyPreset: (preset: Partial<GroundSensorConfigState>) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface StreamLinkProberProps {
  constructedUrl: string;
  sourceType?: StreamSourceType;
  host?: string;
  port?: number;
  streamPath?: string;
  username?: string;
  password?: string;
}

export interface GroundStep4ReviewProps {
  config: GroundSensorConfigState;
  constructedUrl: string;
  onConnect: () => void;
  onBack: () => void;
  isConnecting?: boolean;
}

export interface GroundSensorWizardProps {
  onComplete: (url: string) => void;
  onCancel?: () => void;
}

export interface GroundSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (url: string) => void;
}

export interface MobileGroundFeedCardProps {
  isActive: boolean;
  onConnectRtsp?: (url: string) => void;
  onSelectFeed?: (feedType: StreamSourceType, viewMode: "aerial" | "ground") => void;
}

export interface GroundActiveStreamStateProps {
  onPromote: () => void;
  onReconfigure: () => void;
}

export interface MobileGroundCardHeaderProps {
  isActive: boolean;
}

export interface MobilePixelQuickConnectProps {
  onConnectRtsp?: (url: string) => void;
}

export interface MobileCustomStreamFormProps {
  onConnectRtsp?: (url: string) => void;
}
