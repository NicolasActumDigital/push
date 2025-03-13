import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
  } from "react";
  import { BackHandler, Pressable, View } from "react-native";
  import { Gesture, GestureDetector } from "react-native-gesture-handler";
  import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
    withTiming,
    WithSpringConfig,
    WithTimingConfig,
  } from "react-native-reanimated";
  import { Dimensions, Platform } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
  const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.6;
  
  enum SnapPoint {
    HIDDEN = 0,
    PARTIAL = 1,
    FULL = 2,
  }
  
  export type BottomModalProps = {
    isVisible?: boolean;
    backdropClassName?: string;
    onRequestClose?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    height?: number | string;
    fullHeight?: number | string;
    expandable?: boolean;
    backdropColor?: string;
    className?: string;
    handleAndroidBack?: boolean;
    animation?: "spring" | "timing";
    springConfig?: WithSpringConfig;
    timingConfig?: WithTimingConfig;
    rounded?: boolean;
    useSafeArea?: boolean;
    closeOnBackdropPress?: boolean;
    children: React.ReactNode;
  };
  
  export type BottomModalRef = {
    show: () => void;
    dismiss: () => void;
    expand: () => void;
    collapse: () => void;
    isActive: boolean;
  };
  
  const BottomModal = React.forwardRef<
    BottomModalRef,
    PropsWithChildren<BottomModalProps>
  >(
    (
      {
        isVisible = false,
        backdropClassName,
        height = DEFAULT_HEIGHT,
        fullHeight,
        className = "",
        onRequestClose,
        onOpen,
        onClose,
        children,
        backdropColor = "rgba(0,0,0,0.5)",
        animation = "timing",
        springConfig,
        timingConfig = { duration: 300, easing: Easing.quad },
        rounded = true,
        useSafeArea = true,
        expandable = false,
        handleAndroidBack = true,
        closeOnBackdropPress = true,
      },
      ref,
    ) => {
      const [modalVisible, setModalVisible] = useState(isVisible);
      
      const resolvedHeight = useMemo(() => {
        if (typeof height === 'string' && height.endsWith('%')) {
          return SCREEN_HEIGHT * (parseFloat(height) / 100);
        } else if (typeof height === 'number' && height <= 1 && height > 0) {
          return SCREEN_HEIGHT * height;
        }
        return typeof height === 'number' ? height : DEFAULT_HEIGHT;
      }, [height]);
  
      const resolvedFullHeight = useMemo(() => {
        if (fullHeight) {
          if (typeof fullHeight === 'string' && fullHeight.endsWith('%')) {
            return SCREEN_HEIGHT * (parseFloat(fullHeight) / 100);
          } else if (typeof fullHeight === 'number' && fullHeight <= 1 && fullHeight > 0) {
            return SCREEN_HEIGHT * fullHeight;
          }
          return typeof fullHeight === 'number' ? fullHeight : SCREEN_HEIGHT;
        }
        return Math.max(resolvedHeight, SCREEN_HEIGHT * 0.9);
      }, [fullHeight, resolvedHeight]);
  
      const translateY = useSharedValue(SCREEN_HEIGHT);
      const active = useSharedValue(false);
      const currentSnapPoint = useSharedValue<SnapPoint>(SnapPoint.HIDDEN);
  
      const isActive = useDerivedValue(() => {
        return translateY.value < SCREEN_HEIGHT;
      }, [translateY]);
  
      const runAnimation = useCallback(
        (toValue: number, onFinish?: () => void) => {
          "worklet";
          const animationConfig = animation === "spring"
            ? springConfig || { damping: 20, stiffness: 90 }
            : timingConfig;
  
          if (animation === "spring") {
            translateY.value = withSpring(toValue, animationConfig, () => {
              if (onFinish) {
                runOnJS(onFinish)();
              }
            });
          } else {
            translateY.value = withTiming(toValue, animationConfig, () => {
              if (onFinish) {
                runOnJS(onFinish)();
              }
            });
          }
        },
        [animation, springConfig, timingConfig, translateY],
      );
  
      const showModal = useCallback(() => {
        setModalVisible(true);
        active.value = true;
        runAnimation(SCREEN_HEIGHT - resolvedHeight, () => {
          currentSnapPoint.value = SnapPoint.PARTIAL;
          onOpen?.();
        });
      }, [active, currentSnapPoint, onOpen, resolvedHeight, runAnimation]);
  
      const hideModal = useCallback(() => {
        runAnimation(SCREEN_HEIGHT, () => {
          currentSnapPoint.value = SnapPoint.HIDDEN;
          active.value = false;
          setModalVisible(false);
          onClose?.();
        });
      }, [active, currentSnapPoint, onClose, runAnimation]);
  
      const expandModal = useCallback(() => {
        if (!expandable) return;
        
        runAnimation(SCREEN_HEIGHT - resolvedFullHeight, () => {
          currentSnapPoint.value = SnapPoint.FULL;
        });
      }, [currentSnapPoint, expandable, resolvedFullHeight, runAnimation]);
  
      const collapseModal = useCallback(() => {
        runAnimation(SCREEN_HEIGHT - resolvedHeight, () => {
          currentSnapPoint.value = SnapPoint.PARTIAL;
        });
      }, [currentSnapPoint, resolvedHeight, runAnimation]);
  
      useEffect(() => {
        if (isVisible && !active.value) {
          showModal();
        } else if (!isVisible && active.value) {
          hideModal();
        }
      }, [isVisible, active.value, showModal, hideModal]);
  
      useImperativeHandle(ref, () => ({
        show: showModal,
        dismiss: hideModal,
        expand: expandModal,
        collapse: collapseModal,
        isActive: isActive.value,
      }));
  
      useEffect(() => {
        if (Platform.OS === 'android' && handleAndroidBack) {
          const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isActive.value) {
              hideModal();
              return true;
            }
            return false;
          });
  
          return () => backHandler.remove();
        }
      }, [handleAndroidBack, hideModal, isActive]);
  
      const panGesture = Gesture.Pan()
        .onStart(() => {
          'worklet';
        })
        .onUpdate((event) => {
          'worklet';
          if (event.translationY > 0) {
            translateY.value = 
              (SCREEN_HEIGHT - (currentSnapPoint.value === SnapPoint.FULL ? resolvedFullHeight : resolvedHeight)) + 
              event.translationY * 0.6;
          } else if (expandable && currentSnapPoint.value === SnapPoint.PARTIAL) {
            translateY.value = Math.max(
              SCREEN_HEIGHT - resolvedFullHeight,
              SCREEN_HEIGHT - resolvedHeight + event.translationY
            );
          }
        })
        .onEnd((event) => {
          'worklet';
          const velocityThreshold = 500;
          
          if (event.velocityY > velocityThreshold) {
            runAnimation(SCREEN_HEIGHT, () => {
              runOnJS(hideModal)();
            });
            return;
          }
          
          if (expandable && event.velocityY < -velocityThreshold && currentSnapPoint.value === SnapPoint.PARTIAL) {
            runAnimation(SCREEN_HEIGHT - resolvedFullHeight, () => {
              currentSnapPoint.value = SnapPoint.FULL;
            });
            return;
          }
  
          const currentPosition = translateY.value;
          
          if (
            currentSnapPoint.value === SnapPoint.FULL && 
            currentPosition > SCREEN_HEIGHT - (resolvedFullHeight + resolvedHeight) / 2
          ) {
            runAnimation(SCREEN_HEIGHT - resolvedHeight, () => {
              currentSnapPoint.value = SnapPoint.PARTIAL;
            });
            return;
          }
          
          if (
            currentSnapPoint.value === SnapPoint.PARTIAL && 
            currentPosition > SCREEN_HEIGHT - resolvedHeight / 2
          ) {
            runAnimation(SCREEN_HEIGHT, () => {
              runOnJS(hideModal)();
            });
            return;
          }
          
          if (
            expandable &&
            currentSnapPoint.value === SnapPoint.PARTIAL && 
            currentPosition < SCREEN_HEIGHT - (resolvedHeight + resolvedFullHeight) / 2
          ) {
            runAnimation(SCREEN_HEIGHT - resolvedFullHeight, () => {
              currentSnapPoint.value = SnapPoint.FULL;
            });
            return;
          }
          
          if (currentSnapPoint.value === SnapPoint.FULL) {
            runAnimation(SCREEN_HEIGHT - resolvedFullHeight);
          } else {
            runAnimation(SCREEN_HEIGHT - resolvedHeight);
          }
        });
  
      const containerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
      }));
  
      const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
          translateY.value,
          [SCREEN_HEIGHT, SCREEN_HEIGHT - resolvedHeight],
          [0, 1],
        ),
        display: isActive.value ? 'flex' : 'none',
      }));
  
      if (!modalVisible && !isVisible) {
        return null;
      }
  
      const handleBackdropPress = () => {
        if (closeOnBackdropPress && onRequestClose) {
          onRequestClose();
        }
      };
  
      return (
        <View className="absolute inset-0 z-50">
          <Pressable onPress={handleBackdropPress}>
            <Animated.View
              className={`absolute inset-0 ${backdropClassName || ''}`}
              style={[
                { backgroundColor: backdropColor },
                backdropAnimatedStyle,
              ]}
            />
          </Pressable>
  
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className={`absolute bottom-0 left-0 right-0 bg-white shadow-lg z-50 ${rounded ? 'rounded-t-2xl' : ''} ${className}`}
              style={containerAnimatedStyle}
            >
              <View className="w-10 h-1 bg-gray-300 rounded-full my-2.5 self-center" />
              
              {useSafeArea ? (
                <SafeAreaView className="flex-1" edges={['bottom', 'left', 'right']}>
                  {children}
                </SafeAreaView>
              ) : (
                <View className="flex-1">
                  {children}
                </View>
              )}
            </Animated.View>
          </GestureDetector>
        </View>
      );
    },
  );
  
  export default BottomModal;