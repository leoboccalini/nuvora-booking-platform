import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import BookingFormReference from "./booking/BookingFormReference";
const HeroSection = () => {
    const titleReveal = useScrollReveal({ delay: 200 });
    const subtitleReveal = useScrollReveal({ delay: 400 });
    const buttonReveal = useScrollReveal({ delay: 600 });
    return (<>
      
      <style>{`
        /* Estilo para inputs de texto - esconder placeholder ao focar */
        input[type="text"]:focus::placeholder {
          color: transparent;
        }
        
        /* Flatpickr Dark Theme Customization */
        .flatpickr-calendar {
          background: transparent !important;
          border: 2px solid #f5c400 !important;
          color: white !important;
          border-radius: 10px !important;
          font-family: inherit !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
          overflow: hidden !important;
        }
        
        /* Wrapper para centralização correta */
        .flatpickr-wrapper {
          position: relative !important;
          display: block !important;
        }
        
        .flatpickr-wrapper .flatpickr-calendar {
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          margin: 0 auto !important;
          width: var(--input-width, 320px) !important;
          z-index: 1000 !important;
          transform: translateY(-2px) !important;
        }
        
        .flatpickr-calendar .flatpickr-months {
          background: rgba(0, 0, 0, 0.95) !important;
          border-radius: 9px 9px 0 0 !important;
          margin: 1px 1px 0 1px !important;
        }
        
        .flatpickr-calendar .flatpickr-month {
          background: rgba(0, 0, 0, 0.95) !important;
          color: white !important;
          border-radius: 9px 9px 0 0 !important;
        }
        
        .flatpickr-calendar .flatpickr-current-month .flatpickr-monthDropdown-months,
        .flatpickr-calendar .numInputWrapper {
          background: rgba(0, 0, 0, 0.95) !important;
          color: white !important;
          border: none !important;
        }
        
        .flatpickr-calendar .numInputWrapper input.cur-year {
          background: rgba(0, 0, 0, 0.95) !important;
          color: white !important;
          border: none !important;
        }
        
        .flatpickr-calendar .flatpickr-day {
          color: #ddd !important;
        }
        
        .flatpickr-calendar .flatpickr-day:hover {
          background: rgba(245, 196, 0, 0.2) !important;
          color: #f5c400 !important;
        }
        
        .flatpickr-calendar .flatpickr-day.today {
          border: 1px solid #f5c400 !important;
          background: rgba(245, 196, 0, 0.1) !important;
          color: #f5c400 !important;
        }
        
        .flatpickr-calendar .flatpickr-day.selected {
          background: #f5c400 !important;
          color: #000 !important;
          border-radius: 50% !important;
          border: none !important;
        }
        
        .flatpickr-calendar .flatpickr-weekday {
          color: #ddd !important;
          font-weight: normal !important;
          font-size: 85% !important;
          background: rgba(0, 0, 0, 0.95) !important;
        }
        
        .flatpickr-calendar .flatpickr-weekdays {
          background: rgba(0, 0, 0, 0.95) !important;
        }
        
        .flatpickr-calendar span.flatpickr-weekday {
          background: rgba(0, 0, 0, 0.95) !important;
        }
        
        .flatpickr-time input {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          border: 1px solid #f5c400 !important;
        }
        
        .flatpickr-time .flatpickr-am-pm {
          background: rgba(0, 0, 0, 0.8) !important;
          color: #f5c400 !important;
          border: 1px solid #f5c400 !important;
        }
        
        .flatpickr-time .flatpickr-time-separator {
          color: #f5c400 !important;
        }
        
        /* Melhorias adicionais para o tema escuro */
        .flatpickr-calendar .flatpickr-prev-month,
        .flatpickr-calendar .flatpickr-next-month {
          color: #f5c400 !important;
        }
        
        .flatpickr-calendar .flatpickr-prev-month:hover,
        .flatpickr-calendar .flatpickr-next-month:hover {
          color: white !important;
        }
        
        /* Melhor espaçamento para a tabela de datas */
        .flatpickr-calendar .dayContainer {
          padding: 6px 8px 6px 8px !important;
          background: rgba(0, 0, 0, 0.95) !important;
          border-radius: 0 0 8px 8px !important;
          margin: 0 2px 2px 2px !important;
        }
        
        .flatpickr-calendar .flatpickr-day {
          margin: 1px !important;
          padding: 6px 4px !important;
          min-width: 34px !important;
          min-height: 34px !important;
          line-height: 1.2 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Ocultar dias de outros meses */
        .flatpickr-calendar .flatpickr-day.prevMonthDay,
        .flatpickr-calendar .flatpickr-day.nextMonthDay {
          display: none !important;
        }
        
        /* Ajustar posição do calendário para sobrepor o input */
        .flatpickr-calendar.open {
          margin-top: -5px !important;
          transform: translateY(-2px) !important;
        }
        
        /* Largura dinâmica para calendário e time picker */
        .nuvora-timepicker-popup,
        .flatpickr-calendar {
          width: var(--input-width, 320px) !important;
          max-width: 100% !important;
        }
        
        /* RC-Time-Picker - Tema Dark/Gold respeitando estrutura padrão */
        .nuvora-timepicker-popup {
          background: rgba(0, 0, 0, 0.95);
          border: 1px solid #f5c400;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          font-family: inherit;
        }
        
        /* Painel principal */
        .nuvora-timepicker-popup .rc-time-picker-panel {
          background: rgba(0, 0, 0, 0.95);
          border: none;
          box-shadow: none;
        }
        
        /* Container interno - corrigindo fundo branco */
        .nuvora-timepicker-popup .rc-time-picker-panel-inner {
          background-color: rgba(0, 0, 0, 0.95) !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 8px !important;
        }
        
        /* Input interno do painel */
        .nuvora-timepicker-popup .rc-time-picker-panel-input {
          background: transparent !important;
          color: white !important;
          border: none !important;
          text-align: center !important;
          font-size: 16px !important;
        }
        
        /* Container das colunas - organização equilibrada e centralizada */
        .nuvora-timepicker-popup .rc-time-picker-panel-combobox {
          background: transparent !important;
          display: flex !important;
          justify-content: center !important;
          align-items: stretch !important;
          gap: 12px !important;
          padding: 16px 12px !important;
        }
        
        /* Colunas de seleção - com linhas sutis de separação */
        .nuvora-timepicker-popup .rc-time-picker-panel-select {
          background: transparent !important;
          border: none !important;
          flex: 1 !important;
          max-width: 80px !important;
          min-width: 60px !important;
          position: relative !important;
          border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .nuvora-timepicker-popup .rc-time-picker-panel-select:last-child {
          border-right: none !important;
        }
        
        /* Itens da lista (li) - sem blocos amarelos */
        .nuvora-timepicker-popup .rc-time-picker-panel-select li {
          color: #ddd !important;
          background: transparent !important;
          transition: all 0.2s ease !important;
          padding: 10px 8px !important;
          cursor: pointer !important;
          text-align: center !important;
          font-size: 15px !important;
          border-radius: 0 !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }
        

        
        /* Hover nos itens - sem blocos amarelos */
        .nuvora-timepicker-popup .rc-time-picker-panel-select li:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #f5c400 !important;
        }
        
        /* Lista ul */
        .nuvora-timepicker-popup .rc-time-picker-panel-select ul {
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Input do TimePicker - alinhado com o padrão do date input */
        .rc-time-picker-input {
          background: rgba(0, 0, 0, 0.6) !important;
          color: white !important;
          border: 1px solid rgb(75, 85, 99) !important;
          border-radius: 0.5rem !important;
          padding: 0.75rem 2.5rem 0.75rem 7rem !important;
          height: 3rem !important;
          font-size: 1rem !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .rc-time-picker-input:focus {
          border-color: #f5c400 !important;
          outline: none !important;
        }
        
        .rc-time-picker-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        
        /* Container do TimePicker */
        .rc-time-picker {
          width: 100% !important;
          position: relative !important;
        }
        
        /* Garante que os ícones fiquem por cima do input */
        .rc-time-picker .rc-time-picker-input {
          position: relative !important;
          z-index: 1 !important;
        }
        
        /* Ajuste na largura do popup */
        .nuvora-timepicker-popup {
          width: auto !important;
          min-width: 280px !important;
          max-width: 320px !important;
          padding: 0 !important;
        }
        
        /* Item selecionado - sem bloco amarelo */
        .nuvora-timepicker-popup .rc-time-picker-panel-select-option-selected {
          background: transparent !important;
          color: #f5c400 !important;
          font-weight: bold !important;
          border-radius: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Remove fundo branco e duplicações */
        .nuvora-timepicker-popup .rc-time-picker-panel-select li {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Remove borda de foco feia */
        .nuvora-timepicker-popup .rc-time-picker-panel-select li:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Barras de rolagem customizadas */
        .nuvora-timepicker-popup .rc-time-picker-panel-select::-webkit-scrollbar {
          width: 4px !important;
        }
        
        .nuvora-timepicker-popup .rc-time-picker-panel-select::-webkit-scrollbar-track {
          background: transparent !important;
        }
        
        .nuvora-timepicker-popup .rc-time-picker-panel-select::-webkit-scrollbar-thumb {
          background: rgba(245,196,0,0.6) !important;
          border-radius: 2px !important;
        }
        
        .nuvora-timepicker-popup .rc-time-picker-panel-select::-webkit-scrollbar-thumb:hover {
          background: rgba(245,196,0,0.8) !important;
        }
        
        input[type="text"]:focus::-moz-placeholder { color: transparent; }
        input[type="text"]:focus:-ms-input-placeholder { color: transparent; }
        input[type="text"]:focus::-ms-input-placeholder { color: transparent; }
        
        /* Custom scrollbar styles for time picker */
        .time-picker-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .time-picker-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .time-picker-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 196, 0, 0.6);
          border-radius: 2px;
        }
        
        .time-picker-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 196, 0, 0.8);
        }
      `}</style>
      <section id="booking" className="relative min-h-[90vh] sm:min-h-[90vh] lg:min-h-[80vh] flex flex-col justify-center items-center w-full max-w-full">
        
        <div className="absolute inset-0 w-full max-w-full z-[1]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#494123_0%,_#151515_45%,_#050505_100%)]" aria-hidden="true"/>
          
          <div className="absolute inset-0 bg-black/40 z-[1]"></div>
        </div>

        
        <div className="relative z-[100] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center lg:min-h-[80vh]">
            
            <div className="text-center lg:text-left lg:pr-8 pt-32 lg:pt-0">
              <div ref={titleReveal.ref} className={`scroll-reveal ${titleReveal.isVisible ? "visible" : ""} relative`}>
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight relative" style={{ marginBottom: "30px" }}>
                  Your Journey
                  <span className="text-gold block">Your Way</span>
                </h1>
              </div>
              <div ref={subtitleReveal.ref} className={`scroll-reveal ${subtitleReveal.isVisible ? "visible" : ""}`}>
                <p className="text-base lg:text-xl text-gray-300 mb-8 lg:mb-0 leading-relaxed">
                  Explore a complete booking experience, from your first route to the final confirmation. A public beta by Leo Boccalini.
                </p>
              </div>
            </div>

            
            <div className="lg:pl-8">
              <div ref={buttonReveal.ref} className={`scroll-reveal-scale ${buttonReveal.isVisible ? "visible" : ""}`}>
                <BookingFormReference onSearch={() => { }}/>
              </div>
            </div>
          </div>
        </div>

        
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              
              <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60"></div>
              
              <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent blur-sm opacity-40"></div>
            </div>
          </div>
        </div>

        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-dark-secondary z-20 pointer-events-none"></div>
      </section>
    </>);
};
export default HeroSection;
