"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calculator, BarChart3, Download, Award } from "lucide-react";

interface Step {
    step: number;
    title: string;
    subtitle: string;
    description: string;
    metrics: { label: string };
    image?: string;
}

const steps: Step[] = [
    {
        step: 1,
        title: "Connect",
        subtitle: "Integrate once — measure forever",
        description: "Connect your ad platforms, data streams, or infrastructure once. CarbonLive immediately begins real-time CO₂e tracking across servers, delivery networks, and data transfers — using live grid-intensity data and verified emission factors.",
        metrics: { label: "Instant integration, instant visibility" },
        image: "/how-it-works/connect.jpg"
    },
    {
        step: 2,
        title: "Monitor",
        subtitle: "Real-time insights you can act on",
        description: "View live CO₂e totals, forecasted footprints, and AI-agent recommendations for immediate emission reduction — all mapped to GHG Protocol categories.",
        metrics: { label: "Live dashboards. Instant accountability." },
        image: "/how-it-works/monitor.jpg"
    },
    {
        step: 3,
        title: "Auto-Offset",
        subtitle: "Residuals retired automatically",
        description: "When emissions hit a defined threshold or a campaign ends, CarbonLive automatically retires verified carbon credits from approved registries such as Verra, Gold Standard, ACR.",
        metrics: { label: "Verified offsets, executed automatically." },
        image: "/how-it-works/offset.jpg"
    },
    {
        step: 4,
        title: "Certify & Share",
        subtitle: "Proof you can publish",
        description: "Every offset completed through CarbonLive generates a measure-linked certificate and on-chain reference hash, providing finance teams, auditors, and clients with verifiable proof of real-time emission control and neutrality.",
        metrics: { label: "Transparent data. Trusted results." },
        image: "/how-it-works/certify.jpg"
    },

];

const SkeletonOne = () => {
    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="flex flex-col space-y-4">
                    <div className="bg-[#d1cebb]/20 rounded-lg p-4 border border-[#d1cebb]/40">
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator className="w-5 h-5 text-[#6c5f31]" />
                            <span className="font-semibold text-[#080c04] text-sm">XYZ Campaign (01.08.2025)</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { channel: "DSP Connected:", emissions: "Google DV360", width: "w-12" },
                                { channel: "Impressions:", emissions: "60,000,000", width: "w-10" },
                                { channel: "Active UTM:", emissions: "480", width: "w-16" },
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.channel}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className={`h-2 ${item.width} bg-[#b0ea1d] rounded-full`}></div>
                                    <span className="text-xs text-[#6c5f31] flex-1">{item.channel}</span>
                                    <span className="text-xs font-bold text-[#080c04]">{item.emissions}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#d1cebb]">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-[#080c04] text-sm">Carbon Emission:</span>
                                <span className="font-bold text-base text-[#b0ea1d]">40.2 Mt CO2e</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonTwo = () => {
    const campaigns = [
        { name: "Summer Launch: Relocate ad server region", reduction: 3.2, color: "bg-[#b0ea1d]" },
        { name: "Always-On Digital: Optimise campaign split", reduction: 2.5, color: "bg-[#b0ea1d]" },
        { name: "Holiday Promotions: Reduce redundant ad sets", reduction: 1.8, color: "bg-[#b0ea1d]" },
    ];

    const maxReduction = Math.max(...campaigns.map(c => c.reduction));

    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-[#6c5f31]" />
                        <span className="font-semibold text-[#080c04] text-sm">AI agents reduction tasks</span>
                    </div>

                    {campaigns.map((campaign, idx) => {
                        const barWidth = (campaign.reduction / maxReduction) * 100;

                        return (
                            <motion.div
                                key={campaign.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-[#d1cebb]/10 rounded-lg p-3 border border-[#d1cebb]/40 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-[#080c04] text-xs">{campaign.name}</span>
                                    <span className="text-xs font-bold text-[#b0ea1d]">-{campaign.reduction}tCO₂e</span>
                                </div>
                                <div className="w-full bg-[#d1cebb]/30 rounded-full h-2">
                                    <motion.div
                                        className={`h-2 rounded-full ${campaign.color}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${barWidth}%` }}
                                        transition={{ delay: idx * 0.1 + 0.5, duration: 0.8 }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SkeletonThree = () => {
    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="flex flex-col space-y-4">
                    <div className="text-center pb-3 border-b border-[#d1cebb]">
                        <h3 className="text-base font-bold text-[#080c04]">Retirement Summary</h3>
                    </div>

                    <div className="bg-[#d1cebb]/10 rounded-xl p-4 border border-[#d1cebb]/40 shadow-sm space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <span className="text-xs text-[#6c5f31] font-medium">Campaign:</span>
                                <span className="text-xs font-semibold text-[#080c04] text-right">
                                    Always-On Display Q4
                                </span>
                            </div>

                            <div className="flex justify-between items-start pt-2 border-t border-[#d1cebb]/30">
                                <span className="text-xs text-[#6c5f31] font-medium">Residual Emissions:</span>
                                <span className="text-xs text-[#b0ea1d] font-semibold">1.26 tCO₂e</span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-[#d1cebb]/30">
                                <span className="text-xs text-[#6c5f31] font-medium">Offset Project:</span>
                                <span className="text-xs font-bold text-[#080c04]">Indonesia Mangrove (GS)</span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-[#d1cebb]/30">
                                <span className="text-xs text-[#6c5f31]">Retirement ID:</span>
                                <span className="text-xs font-mono font-semibold text-[#080c04] bg-[#d1cebb]/20 px-2 py-1 rounded">
                                    GS-984-212-B77
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button className="w-full bg-[#b0ea1d] hover:bg-[#F0db18] text-[#080c04] font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md text-xs">
                                <Download className="w-3 h-3" />
                                Download Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkeletonFour = () => {
    return (
        <div className="relative flex items-center justify-center h-full w-full">
            <div className="w-[90%] max-w-md p-6 mx-auto bg-[#fcfdf6] shadow-xl rounded-xl border border-[#d1cebb]">
                <div className="flex flex-col space-y-4">
                    <div className="bg-[#d1cebb]/10 rounded-lg p-4 border border-[#d1cebb]/40">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-[#6c5f31]" />
                            <span className="font-semibold text-[#080c04] text-sm">Certificate Snippet</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-xs font-medium text-[#6c5f31]">Certified Campaign:</span>
                                <span className="text-sm font-bold text-[#080c04]">Brand Awareness Q3</span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-xs font-medium text-[#6c5f31]">Total CO₂e Neutralised:</span>
                                <span className="text-sm font-bold text-[#b0ea1d]">4.9 tCO₂e</span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-xs font-medium text-[#6c5f31]">Issued:</span>
                                <span className="text-xs font-semibold text-[#080c04]">15 October 2025</span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b border-[#d1cebb]/30">
                                <span className="text-xs font-medium text-[#6c5f31]">Certificate ID:</span>
                                <span className="text-xs font-bold text-[#080c04]">CC-BAQ3-2025</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-[#6c5f31]">On-Chain Reference:</span>
                                <span className="text-xs font-bold text-[#080c04]">Hash #0x8aF9…D12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const stepComponents = [SkeletonOne, SkeletonTwo, SkeletonThree, SkeletonFour];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const fieldsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const sectionTop = sectionRef.current.offsetTop;
            const sectionHeight = sectionRef.current.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress through the section (0 to 1)
            const progress = Math.max(0, Math.min(1,
                (scrollY - sectionTop + windowHeight * 0.5) / sectionHeight
            ));
            setScrollProgress(progress);

            // Slower step progression - requires more scrolling between steps
            // Each step now requires ~8-10 scroll actions to progress
            const stepProgress = progress * 4; // 0 to 4
            const stepIndex = Math.min(Math.floor(stepProgress), 3); // 0, 1, 2, or 3

            setActiveStep(stepIndex);
        };

        // Throttle scroll events for smoother experience
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", scrollHandler);
        handleScroll();

        return () => window.removeEventListener("scroll", scrollHandler);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative z-10 overflow-clip bg-[#fcfdf6]"
            id="what-we-do"
            aria-label="What We Do"
            style={{ "--progress": scrollProgress } as React.CSSProperties}
        >
            {/* Parallax Wrapper - Increased height for slower progression */}
            <div className="prllx-wrapper relative flex h-[800lvh] flex-col overflow-clip md:h-[1600lvh] md:flex-row ">

                {/* Left Side - Sticky Fields */}
                <div className="fields-sticky sticky top-0 z-10 h-lvh w-full md:w-1/2 flex items-center justify-center">
                    {/* Dashed Grid Background with Parallax Movement */}
                    <div
                        className="absolute top-0 -z-10 left-20 h-full mb-40 w-4 text-[#fdcf29]"
                        style={{
                            opacity: 0.5,
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M 0 0 L 10 0 M 0 0 L 0 10' stroke='currentColor' stroke-dasharray='2 2' stroke-width='1' vector-effect='non-scaling-stroke'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundSize: "1em 1em",
                            backgroundPosition: `center calc(50% - ${scrollProgress * 2000}px)`
                        }}
                    />

                    {/* Fields Container */}
                    <div
                        ref={fieldsRef}
                        className="relative w-full max-w-2xl px-6"
                    >
                        <ul className="fields-wrapper relative flex w-full">
                            {steps.map((step, index) => {
                                const isActive = activeStep === index;
                                const rotationDegrees = isActive ? 720 : (index < activeStep ? 720 : 0);

                                return (
                                    <li
                                        key={index}
                                        className="absolute inset-0 flex flex-col justify-center w-full transition-opacity duration-700"
                                        style={{
                                            opacity: isActive ? 1 : 0,
                                            pointerEvents: isActive ? 'auto' : 'none'
                                        }}
                                    >
                                        <div className="flex items-start gap-6">
                                            {/* Step Number */}
                                            <div className="shrink-0 font-medium font-mono text-sm text-[#6c5f31]">
                                                <div>0{step.step}</div>
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex-1 flex flex-col items-start gap-4 md:gap-6">
                                                {/* Icon with Rotating Outline */}
                                                <div className="relative h-10 w-10">
                                                    {/* Icons commented out */}
                                                </div>

                                                {/* Title with Double Layer Reveal */}
                                                <h2 className="-mb-2.5 overflow-clip font-medium text-2xl md:text-4xl text-[#080c04]">
                                                    <div
                                                        className="title-wrapper relative flex flex-col transition-transform duration-700"
                                                        style={{
                                                            transform: isActive ? "translateY(-100%)" : "translateY(0)"
                                                        }}
                                                    >
                                                        <span className="absolute top-full left-0 pb-2.5">{step.title}</span>
                                                        <span className="pb-2.5">{step.title}</span>
                                                    </div>
                                                </h2>

                                                {/* Subtitle */}
                                                <p className="text-base md:text-lg font-semibold text-[#6c5f31]">
                                                    {step.subtitle}
                                                </p>

                                                {/* Description */}
                                                <p className="text-sm text-[#6c5f31]/80 leading-[1.4]">
                                                    {step.description}
                                                </p>

                                                {/* Metrics Badge */}
                                                <div className="inline-block bg-[#b0ea1d]/10 border border-[#b0ea1d]/30 rounded-full px-5 py-2.5">
                                                    <span className="text-xs md:text-sm font-semibold text-[#6c5f31]">
                                                        {step.metrics.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Right Side - Sticky Animation/Image Panel */}
                <div className="absolute top-0 right-0 z-0 h-full w-full md:w-1/2">

                    <div className="w-full flex justify-end px-4 md:px-10">
                        <div className="max-w-2xl text-end">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#d1cebb] leading-tight">
                                How it works
                            </h2>

                            <p className="mt-4 text-base md:text-lg text-[#080c04]/80 leading-relaxed">
                                CarbonLive measures, reduces, and offsets emissions in real time — starting with
                                internet advertising and expanding to energy and gas sectors.
                            </p>
                        </div>
                    </div>

                    <div className="anim-wrapper sticky top-0 left-0 h-lvh w-full">
                        <div
                            className="anim-bg-wrapper absolute inset-0"
                        >
                            {steps.slice(0, 4).map((step, index) => (
                                <div
                                    key={index}
                                    className="anim-bg-img absolute inset-0 transition-opacity duration-700"
                                    style={{
                                        opacity: activeStep === index ? 1 : 0,
                                        visibility: activeStep === index ? "visible" : "hidden"
                                    }}
                                >
                                    {/* Render step components */}
                                    {stepComponents[index] && stepComponents[index]()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
