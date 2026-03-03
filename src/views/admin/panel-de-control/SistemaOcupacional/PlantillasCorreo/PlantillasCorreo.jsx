import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ComboboxEmpresas, ComboboxContratas } from '../Admision/model/Combobox';
import { useAuthStore } from '../../../../../store/auth';

export default function PlantillasCorreo() {
    const token = useAuthStore((state) => state.token);
    const empresas = ComboboxEmpresas();
    const contratas = ComboboxContratas();

    // Estados para búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [selectedContrata, setSelectedContrata] = useState(null);

    // Estados para el gestor de correos
    const defaultArchivos = [
        { id: 1, label: 'ENPO', checked: true },
        { id: 2, label: 'RAYOS X TORAX', checked: true },
        { id: 3, label: 'RAYOS X COLUMNA 1', checked: true },
        { id: 4, label: 'RAYOS X COLUMNA 2', checked: true },
        { id: 5, label: 'CAMO ADMINISTRATIVO', checked: true },
        { id: 6, label: 'MATRIZ', checked: true },
        { id: 7, label: 'CAMO', checked: true },
    ];

    const initialEmailForm = {
        destino: '',
        cc: '',
        asunto: 'Paciente: {NombrePaciente} {NombreSede}',
        archivos: defaultArchivos,
        mensaje: 'Estimados {Empresa},\n\nCon relación al paciente {NombrePaciente}, se adjuntan los resultados de {Examen}.\n\nAtentamente,\n{Usuario}'
    };

    const [emailForms, setEmailForms] = useState([initialEmailForm]);

    const handleSearch = () => {
        if (!searchTerm) return;

        const filteredEmp = empresas.filter(e =>
            e.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.ruc.includes(searchTerm)
        ).map(e => ({ ...e, type: 'EMPRESA' }));

        const filteredCon = contratas.filter(c =>
            c.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.ruc.includes(searchTerm)
        ).map(c => ({ ...c, type: 'CONTRATA' }));

        setFilteredResults([...filteredEmp, ...filteredCon]);
        setShowSearchPanel(true);
    };

    const handleSelect = (item) => {
        if (item.type === 'EMPRESA') {
            setSelectedEmpresa(item);
        } else {
            setSelectedContrata(item);
        }
        setShowSearchPanel(false);
        setSearchTerm('');
    };

    const addEmailForm = () => {
        setEmailForms(prev => [...prev, { ...initialEmailForm, archivos: defaultArchivos.map(a => ({ ...a })) }]);
    };

    const handleEmailChange = (index, e) => {
        const { name, value } = e.target;
        setEmailForms(prev => {
            const newForms = [...prev];
            newForms[index] = { ...newForms[index], [name]: value };
            return newForms;
        });
    };

    const toggleArchivo = (formIndex, archivoId) => {
        setEmailForms(prev => {
            const newForms = [...prev];
            newForms[formIndex] = {
                ...newForms[formIndex],
                archivos: newForms[formIndex].archivos.map(a =>
                    a.id === archivoId ? { ...a, checked: !a.checked } : a
                )
            };
            return newForms;
        });
    };

    const removeEmailForm = (index) => {
        setEmailForms(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-blue-900">Configuración Plantillas Correo</h1>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Lado Izquierdo: Selección de Empresa/Contrata */}
                <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por empresa/contrata
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="RUC o Razón Social..."
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-800 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>

                    {/* Panel de resultados de búsqueda */}
                    {showSearchPanel && (
                        <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden bg-white shadow-lg animate-in fade-in duration-200">
                            <div className="flex justify-between items-center bg-blue-800 text-white px-3 py-2">
                                <span className="font-bold text-sm">Resultados de búsqueda</span>
                                <button onClick={() => setShowSearchPanel(false)} className="hover:text-gray-300">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                    <thead className="bg-gray-100 text-gray-700 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 border-b">Empresa</th>
                                            <th className="px-3 py-2 border-b">Contrata</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResults.length > 0 ? (
                                            filteredResults.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    <td className="px-3 py-2 font-medium">
                                                        {item.type === 'EMPRESA' ? item.razonSocial : '-'}
                                                    </td>
                                                    <td className="px-3 py-2 font-medium text-blue-600">
                                                        {item.type === 'CONTRATA' ? item.razonSocial : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="px-3 py-6 text-center text-gray-500 italic">
                                                    No se encontraron resultados
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                EMPRESA
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={selectedEmpresa?.razonSocial || ''}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-700 font-medium"
                                placeholder="Ninguna seleccionada"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                CONTRATA
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={selectedContrata?.razonSocial || ''}
                                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-700 font-medium"
                                placeholder="Ninguna seleccionada"
                            />
                        </div>
                    </div>
                </div>

                {/* Lado Derecho: Gestor de Correos */}
                <div className="w-full md:w-2/3 space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={addEmailForm}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-gray-300 flex items-center gap-2 font-medium transition-colors"
                        >
                            Agregar Correo <FontAwesomeIcon icon={faPlus} className="text-blue-800" />
                        </button>
                    </div>

                    {emailForms.map((emailForm, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 relative">
                            <button
                                onClick={() => removeEmailForm(index)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Eliminar plantilla"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-semibold text-gray-700">Destino:</label>
                                    <input
                                        type="text"
                                        name="destino"
                                        value={emailForm.destino}
                                        onChange={(e) => handleEmailChange(index, e)}
                                        placeholder="ejemplo@correo.com, ..."
                                        className="flex-1 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-semibold text-gray-700">C.C.:</label>
                                    <input
                                        type="text"
                                        name="cc"
                                        value={emailForm.cc}
                                        onChange={(e) => handleEmailChange(index, e)}
                                        placeholder="copia@correo.com, ..."
                                        className="flex-1 border-b border-gray-300 py-1 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-semibold text-gray-700">Asunto:</label>
                                    <input
                                        type="text"
                                        name="asunto"
                                        value={emailForm.asunto}
                                        onChange={(e) => handleEmailChange(index, e)}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Archivos:</label>
                                    <div className="flex flex-wrap gap-4">
                                        {emailForm.archivos.map(archivo => (
                                            <div key={archivo.id} className="flex flex-col items-center gap-1">
                                                <button
                                                    onClick={() => toggleArchivo(index, archivo.id)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded border-2 transition-all ${archivo.checked
                                                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-300'
                                                        }`}
                                                >
                                                    <FontAwesomeIcon icon={archivo.checked ? faCheck : faTimes} />
                                                </button>
                                                <span className="text-[10px] text-gray-500 font-medium uppercase text-center w-20 leading-tight">
                                                    {archivo.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="text-sm font-semibold text-gray-700">Mensaje</label>
                                    </div>
                                    <textarea
                                        name="mensaje"
                                        value={emailForm.mensaje}
                                        onChange={(e) => handleEmailChange(index, e)}
                                        rows="8"
                                        className="w-full border border-gray-300 rounded-md p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono"
                                    ></textarea>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Puedes usar variables como <span className="font-semibold">{'{empresa}'}</span>, <span className="font-semibold">{'{nombrepaciente}'}</span>, <span className="font-semibold">{'{tipoExamen}'}</span>. Para negritas escribe <span className="font-semibold">** así **</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

