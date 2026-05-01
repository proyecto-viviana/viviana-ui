import {
  children as resolveChildren,
  type JSX,
  createEffect,
  createSignal,
  mergeProps,
  splitProps,
} from "solid-js";
import {
  Button as HeadlessButton,
  type ButtonRenderProps,
} from "@proyecto-viviana/solidaria-components";
import type { ButtonFillStyle, ButtonProps, ButtonSize, ButtonVariant } from "./types";
import { useProviderProps } from "../provider";
import {
  s2Button,
  s2ButtonGradient,
  s2ButtonPendingIndicator,
  s2ButtonText,
  type S2ButtonRenderState,
} from "./s2-button-styles";

export function Button(props: ButtonProps): JSX.Element {
  const providerProps = useProviderProps(props);
  const defaultProps: Partial<ButtonProps> = {
    variant: "primary",
    size: "M",
    fillStyle: "fill",
  };

  const merged = mergeProps(defaultProps, providerProps, props);

  const [local, headlessProps] = splitProps(merged, [
    "variant",
    "fillStyle",
    "size",
    "staticColor",
    "styles",
    "UNSAFE_className",
    "UNSAFE_style",
    "children",
    "isPending",
    "onPress",
  ]);

  const [isProgressVisible, setIsProgressVisible] = createSignal(false);
  const resolvedChildren = resolveChildren(() => local.children);

  createEffect(() => {
    if (local.isPending) {
      setIsProgressVisible(true);
    } else {
      setIsProgressVisible(false);
    }
  });

  const variant = (): ButtonVariant => local.variant ?? "primary";
  const fillStyle = (): ButtonFillStyle => local.fillStyle ?? "fill";
  const size = (): ButtonSize => local.size ?? "M";
  const isStaticColor = () => !!local.staticColor;

  const getS2State = (renderProps: ButtonRenderProps): S2ButtonRenderState => ({
    isHovered: renderProps.isHovered,
    isPressed: renderProps.isPressed,
    isFocused: renderProps.isFocused,
    isFocusVisible: renderProps.isFocusVisible,
    isDisabled: renderProps.isDisabled,
    isPending: local.isPending,
  });

  const getClassName = (renderProps: ButtonRenderProps): string =>
    [
      local.UNSAFE_className,
      s2Button(
        {
          ...getS2State(renderProps),
          variant: variant(),
          fillStyle: fillStyle(),
          size: size(),
          staticColor: local.staticColor,
          isStaticColor: isStaticColor(),
        },
        local.styles,
      ),
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <HeadlessButton
      {...headlessProps}
      isPending={local.isPending}
      isPendingFocusable
      onPress={(event) => {
        if (!local.isPending) {
          local.onPress?.(event);
        }
      }}
      class={getClassName}
      style={local.UNSAFE_style}
      data-variant={variant()}
      data-style={fillStyle()}
      data-size={size()}
      data-static-color={local.staticColor || undefined}
    >
      {(renderProps) => {
        const state = () => getS2State(renderProps);
        const content = () => resolvedChildren();
        return (
          <>
            {variant() === "genai" || variant() === "premium" ? (
              <span
                class={s2ButtonGradient({
                  ...state(),
                  variant: variant() as Extract<ButtonVariant, "premium" | "genai">,
                })}
              />
            ) : null}
            {typeof content() === "string" ? (
              <span
                class={s2ButtonText({ isProgressVisible: isProgressVisible() })}
                data-rsp-slot="text"
              >
                {content()}
              </span>
            ) : (
              content()
            )}
            {local.isPending ? (
              <span
                class={s2ButtonPendingIndicator({
                  isPending: local.isPending,
                  isProgressVisible: isProgressVisible(),
                })}
              >
                <span
                  role="progressbar"
                  aria-label="pending"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </span>
            ) : null}
          </>
        );
      }}
    </HeadlessButton>
  );
}
