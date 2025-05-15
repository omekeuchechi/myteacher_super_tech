import { useEffect } from "react";

const funFacts = [
    {
        title: "Did You Know?",
        fact: "The first computer mouse was made of wood in 1964 by Douglas Engelbart."
    },
    {
        title: "Tech Trivia",
        fact: "The first 1GB hard disk drive was announced in 1980, weighed 550 pounds, and cost $40,000."
    },
    {
        title: "Programming Fun",
        fact: "The first computer bug was an actual moth found in a computer in 1947."
    },
    {
        title: "Internet Growth",
        fact: "Over 5 billion people use the internet as of 2024."
    }
];

const FunTech = () => {
    useEffect(() => {
        // Example: Animate facts on mount
        const cards = document.querySelectorAll('.funtech-card');
        cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('show'), 200 * i);
        });

        // Cleanup function to remove animations
        return () => {
            cards.forEach(card => card.classList.remove('show'));
        };
    }, []);

    return (
        <section className="funtech-section fade-in">
            <h2 className="funtech-title">Fun Tech Facts</h2>
            <div className="funtech-cards">
                {funFacts.map((item, idx) => (
                    <div className="funtech-card" key={idx}>
                        <h3>{item.title}</h3>
                        <p>{item.fact}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FunTech;