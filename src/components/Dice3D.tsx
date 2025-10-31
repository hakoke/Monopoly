import { useEffect, useRef, useState } from "react";
import "./Dice3D.css";

interface Dice3DProps {
    value1?: number;
    value2?: number;
    animated?: boolean;
}

export default function Dice3D({ value1 = 3, value2 = 4, animated = true }: Dice3DProps) {
    const dice1Ref = useRef<HTMLDivElement>(null);
    const dice2Ref = useRef<HTMLDivElement>(null);
    const [diceValues, setDiceValues] = useState({ val1: value1, val2: value2 });

    useEffect(() => {
        if (!animated) return;

        const interval = setInterval(() => {
            const newVal1 = Math.floor(Math.random() * 6) + 1;
            const newVal2 = Math.floor(Math.random() * 6) + 1;
            setDiceValues({ val1: newVal1, val2: newVal2 });
            
            if (dice1Ref.current) {
                dice1Ref.current.style.transition = 'transform 0.3s ease-out';
                dice1Ref.current.style.transform = `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg)`;
            }
            if (dice2Ref.current) {
                dice2Ref.current.style.transition = 'transform 0.3s ease-out';
                dice2Ref.current.style.transform = `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg)`;
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [animated]);

    const renderDiceFace = (value: number) => {
        const positions: { [key: number]: number[][] } = {
            1: [[0, 0]],
            2: [[-1, -1], [1, 1]],
            3: [[-1, -1], [0, 0], [1, 1]],
            4: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
            5: [[-1, -1], [-1, 1], [0, 0], [1, -1], [1, 1]],
            6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]],
        };

        const positionsForValue = positions[value] || positions[1];

        return positionsForValue.map((pos, idx) => (
            <div
                key={idx}
                className="dot"
                style={{
                    gridColumn: pos[0] === -1 ? 1 : pos[0] === 0 ? 2 : 3,
                    gridRow: pos[1] === -1 ? 1 : pos[1] === 0 ? 2 : 3,
                }}
            />
        ));
    };

    const currentValue1 = animated ? diceValues.val1 : value1;
    const currentValue2 = animated ? diceValues.val2 : value2;

    return (
        <div className="dice-container">
            <div className="dice-wrapper">
                <div className="dice" ref={dice1Ref} data-value={currentValue1}>
                    <div className="dice-face front">{renderDiceFace(currentValue1)}</div>
                    <div className="dice-face back">{renderDiceFace(currentValue1)}</div>
                    <div className="dice-face right">{renderDiceFace(currentValue1)}</div>
                    <div className="dice-face left">{renderDiceFace(currentValue1)}</div>
                    <div className="dice-face top">{renderDiceFace(currentValue1)}</div>
                    <div className="dice-face bottom">{renderDiceFace(currentValue1)}</div>
                </div>
            </div>
            <div className="dice-wrapper">
                <div className="dice" ref={dice2Ref} data-value={currentValue2}>
                    <div className="dice-face front">{renderDiceFace(currentValue2)}</div>
                    <div className="dice-face back">{renderDiceFace(currentValue2)}</div>
                    <div className="dice-face right">{renderDiceFace(currentValue2)}</div>
                    <div className="dice-face left">{renderDiceFace(currentValue2)}</div>
                    <div className="dice-face top">{renderDiceFace(currentValue2)}</div>
                    <div className="dice-face bottom">{renderDiceFace(currentValue2)}</div>
                </div>
            </div>
        </div>
    );
}
