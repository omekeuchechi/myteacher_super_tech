import {useEffect} from 'react';

const Testimonial = () => {
    return (
        <section className='tes-video fade-in'>
            <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/N8tarawoozs?si=cEFakg3ji_RuYBkF" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen>
            </iframe>
        </section>
    );
};

export default Testimonial;