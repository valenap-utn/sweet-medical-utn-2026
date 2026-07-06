export default function IconBadge({
                                      icon: Icon,
                                      size = "md",
                                      variant = "soft",
                                  }) {
    const sizes = {
        sm: {
            box: 30,
            icon: 13,
        },
        md: {
            box: 42,
            icon: 18,
        },
        lg: {
            box: 52,
            icon: 22,
        },
    };

    const variants = {
        soft: {
            background: "var(--p-fixed)",
            color: "var(--p)",
            border: "1px solid var(--p-fixed-dim)",
        },
        outline: {
            background: "#fff",
            color: "var(--p)",
            border: "1px solid var(--outline-v)",
        },
        solid: {
            background: "var(--p)",
            color: "#fff",
            border: "1px solid var(--p)",
        },
        muted: {
            background: "rgba(123, 26, 48, .08)",
            color: "var(--p)",
            border: "1px solid transparent",
        },
    };

    const s = sizes[size];
    const v = variants[variant];

    return (
        <span
            style={{
                width: s.box,
                height: s.box,
                minWidth: s.box,
                borderRadius: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: v.background,
                color: v.color,
                border: v.border,
            }}
        >
      <Icon size={s.icon}/>
    </span>
    );
}
