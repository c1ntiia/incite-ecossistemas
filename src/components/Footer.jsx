import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-300 text-slate-300 py-5 border-t-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center md:items-start text-center md:text-left">

                <div className="flex flex-col items-center md:items-start">
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 tracking-tight mb-2">
                    INCITE
                    </span>
                    <p className="text-sm text-slate-900 leading-relaxed">
                    Restauração e Conservação de Ecossistemas Terrestres Baianos.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-slate-900 font-semibold mb-4 uppercase tracking-wider text-sm">
                    Contato
                    </h3>
                    <a 
                    href="mailto:incite2025@gmail.com" 
                    className="text-slate-900 flex items-center gap-2 hover:text-emerald-700 transition-colors"
                    >
                    <Mail className="w-5 h-5" />
                    incite2025@gmail.com
                    </a>
                </div>

                <div className="flex flex-col items-center md:items-start">
                
                    <h3 className="text-slate-900 font-semibold uppercase tracking-wider text-sm">
                    Apoio
                    </h3>
                    <div className="flex gap-4">
                        <div className="p-2 rounded-lg h-20 w-34 flex items-center justify-center">
                            <img 
                            src="/logoFapesb.png" 
                            alt="Fapesb" 
                            className="max-h-full max-w-full object-contain" 
                            />
                        </div>
                        <div className="p-2 rounded-lg h-20 w-34 flex items-center justify-center">
                            <img 
                            src="/govSECTI.png" 
                            alt="SECTI- Estado da Bahia" 
                            className="max-h-full max-w-full object-contain" 
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>
  );
}