import { useEffect } from "react";

const Faq = () => {
    useEffect(() => {
        const faqItems = document.querySelectorAll(".faq-item");
        const faqIcons = document.querySelectorAll(".faq-icon");

        function toggleActive(index) {
            faqItems[index].classList.toggle("active");
            faqIcons[index].classList.toggle("active");
        }

        faqIcons.forEach((icon, index) => {
            // Use a named function for cleanup
            function handleClick(e) {
                e.stopPropagation();
                toggleActive(index);
            }
            icon.addEventListener("click", handleClick);
            // Store handler for cleanup
            icon._faqHandler = handleClick;
        });

        // Cleanup event listeners on unmount
        return () => {
            faqIcons.forEach((icon) => {
                if (icon._faqHandler) {
                    icon.removeEventListener("click", icon._faqHandler);
                    delete icon._faqHandler;
                }
            });
        };
    }, []);

    return (
        <div className="faq">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
                <div className="faq-icon"></div>
                <h3>What is the Digital Skills Bootcamp?</h3>
                <p>The Digital Skills Bootcamp is a comprehensive program designed to equip individuals with essential digital skills for today's job market.</p>
            </div>
            <div className="faq-item">
                <div className="faq-icon"></div>
                <h3>How long does the bootcamp last?</h3>
                <p>The bootcamp typically lasts for 12 weeks, with classes held twice a week.</p>
            </div>
            {/* Add more FAQ items as needed */}
        </div>
    );
};

export default Faq;