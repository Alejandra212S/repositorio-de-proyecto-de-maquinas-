const { useEffect, useState } = React;

const db = window.db;
const firestoreApi = window.firestoreApi || {};
const {
  collection: firestoreCollection,
  getDocs: firestoreGetDocs,
  getDoc: firestoreGetDoc,
  setDoc: firestoreSetDoc,
  deleteDoc: firestoreDeleteDoc,
  doc: firestoreDoc,
} = firestoreApi;

const Icon = ({ symbol, className = "" }) => (
  <span className={className} aria-hidden="true">{symbol}</span>
);
const Home = (props) => <Icon {...props} symbol="☉" />;
const Monitor = (props) => <Icon {...props} symbol="←" />;
const Mouse = (props) => <Icon {...props} symbol="く" />;
const AlertTriangle = (props) => <Icon {...props} symbol="▣" />;
const Grid = (props) => <Icon {...props} symbol="◱" />;
const RotateCcw = (props) => <Icon {...props} symbol="↻" />;
const CheckCircle = (props) => <Icon {...props} symbol="✓" />;
const Mail = (props) => <Icon {...props} symbol="☏" />;
const Search = (props) => <Icon {...props} symbol="⌕" />;
const Plus = (props) => <Icon {...props} symbol="≡" />;
const Archive = (props) => <Icon {...props} symbol="⎙" />;

const inventoryData = {
  inicio: {
    title: "Inicio",
    desc: "Bienvenido al sistema de inventario del area de TI. Aqui puedes ver los estados de los equipos de computo, impresoras y telefonia.",
    icon: <Home className="w-4-h-412/" />,
    metrics: [
      { label: "Dañados", tone: "gray" },
      { label: "En uso", tone: "gray" },
      { label:"Disponibles", tone :"gray"}
    ],
    content: [
      {  name: "Panel General de Equipos", desc: "Total de equipos:  | Activos:  | Dañados:" },
      {  name: "Telefonia", desc: "Total de equipos:  | En uso: " },
      {  name: "Tipo de Equipos", desc: "Total de equipos: o | Activos:  | Dañados: " },
      {  name: "Impresoras", desc: "Reporte de toners, cartuchos y mantenimiento" }
    ]
  },
  computadoras: {
    title: "Equipo de computo",
    desc: "Consulta de equipo técnico de PCs, laptops, tablets y monitores.",
    icon: <Monitor className="w-4-h-412/" />,

    content: [
      
    ]
  },
  licencias: {
    title: "Software y Licencias",
    desc: "Consulta y administra el software utilizado, sus licencias y fechas de renovación.",
     icon: <AlertTriangle className="w-4-h-412/" />,
    content: [

    ]
  },
  noFuncionales: {
    title: "Equipos Dañados ",
    desc: "Para agregar un equipo dañado debes de tomar una foto del equipo y subirla al sistema",
     icon: <Mouse className="w-4-h-412/" />,
    content: [
 
    ]
  },
  porArea: {
    title: "Equipos por area",
    desc:"Descripción de los equipos por área ",
     icon: <Grid className="w-4-h-412/" />,
    content: [
    ]
  },
  recuperados: {
    title: "Equipos recuperados",
    desc: "Descripción de los equipos que han sido reparados, vendidos o reasignados a otra área",
    icon: <RotateCcw className="w-4-h-412/" />,
    content: [

    ]


  },
  Impresoras: {
    title: "Impresoras y Toners",
    desc: "Gestión de impresoras y consumibles.",
    icon: <Archive className="w-4-h-412/" />,

    content: [
    ]
  },
  Telefonia: {
    title: "Telefonía",
    desc:"Gestión de telefonos y dispositivos de comunicación.",
    icon: <Mail className="w-4-h-412/" />,
   
    content: [
    ]
  },
  Poliza: {
    title: "Polizas de soporte",
    desc: "Gestión de programas y polizas de soporte.",
    icon: <Grid className="w-4-h-412/" />,

    content: [
    ]
  },
  Articulos: {
    title: "Artículos",
    desc: "Gestión de articlos que se tiene en cada area desginada",
    icon: <Search className="w-4-h-412/" />,

    content: [
    ]

  },
  Ckecklist: {
    title: "Ckecklist",
    desc: "Aqui puedes encontrar información para realizar checklist de los equipos de computo, impresoras y telefonia.",
    icon: <CheckCircle className="w-4-h-412/" />,

    content: [
    ]

  },
  Configuración: {
    title: "Configuración",
    desc: "Configuración del sistema.",
    icon: <Plus  className="w-4-h-412/" />,

    content: [
    ]
  }
};

const genericSectionConfig = {
  noFuncionales: {
    collection: 'defectuosos',
    label: 'Equipo defectuoso',
    fields: [
      { key: 'name', label: 'Nombre o modelo', placeholder: 'Ej. HP ProBook', required: true },
      { key: 'type', label: 'Tipo de equipo', type: 'select', options: ['Laptop', 'PC de escritorio', 'Monitor', 'Tablet', 'Impresora'] },
      { key: 'area', label: 'Área asignada', placeholder: 'Ej. Producción' },
      { key: 'problem', label: 'Falla reportada', placeholder: 'Ej. No enciende', required: true },
      { key: 'priority', label: 'Prioridad', type: 'select', options: ['Alta', 'Media', 'Baja'] },
      { key: 'notes', label: 'Notas', placeholder: 'Observaciones adicionales' },
    ],
  },
 // Configuración para equipos por área
  porArea: {
    collection: 'equiposPorArea',
    label: 'Equipo por área',
    fields: [
      { key: 'name', label: 'Nombre o modelo', placeholder: 'Ej. Dell OptiPlex', required: true },
      { key: 'type', label: 'Tipo de equipo', type: 'select', options: ['Laptop', 'PC de escritorio', 'Monitor', 'Tablet', 'Impresora'] },
      { key: 'area', label: 'Área', type: 'select', options: ['Almacén', 'Calidad', 'Comercial', 'Compras', 'Finanzas', 'Mantenimiento', 'Moldes', 'Producción', 'Recursos Humanos', 'Sistemas'], required: true },
      { key: 'assignedTo', label: 'Responsable', placeholder: 'Nombre del responsable' },
      { key: 'status', label: 'Estado', type: 'select', options: ['Disponible', 'En uso', 'Operativo'] },
    ],
  },
  Impresoras: {
    collection: 'impresoras',
    label: 'Impresora o toner',
    fields: [
      { key: 'name', label: 'Nombre o modelo', placeholder: 'Ej. HP LaserJet Pro', required: true },
      { key: 'type', label: 'Tipo', type: 'select', options: ['Impresora', 'Multifuncional', 'Toner', 'Cartucho'] },
      { key: 'area', label: 'Área asignada', placeholder: 'Ej. Almacén' },
      { key: 'serial', label: 'Número de serie', placeholder: 'Número de serie' },
      { key: 'status', label: 'Estado', type: 'select', options: ['Disponible', 'En uso', 'Mantenimiento', 'Agotado'] },
      { key: 'tonerMagenta', label: 'Tóner magenta (%)', type: 'number', placeholder: '100', required: true },
      { key: 'tonerBlack', label: 'Tóner negro (%)', type: 'number', placeholder: '100', required: true },
      { key: 'tonerCyan', label: 'Tóner cian (%)', type: 'number', placeholder: '100', required: true },
      { key: 'tonerYellow', label: 'Tóner amarillo (%)', type: 'number', placeholder: '100', required: true },
    ],
  },
  Telefonia: {
    collection: 'telefonia',
    label: 'Dispositivo de telefonía',
    fields: [
      { key: 'name', label: 'Dispositivo o modelo', placeholder: 'Ej. iPhone 15', required: true },
      { key: 'type', label: 'Tipo', type: 'select', options: ['Celular', 'Teléfono fijo', 'Radio', 'Accesorio'] },
      { key: 'area', label: 'Área asignada', placeholder: 'Ej. Sistemas' },
      { key: 'assignedTo', label: 'Asignado a', placeholder: 'Nombre del usuario' },
      { key: 'status', label: 'Estado', type: 'select', options: ['Disponible', 'En uso', 'Baja'] },
    ],
  },
  Poliza: {
    collection: 'polizas',
    label: 'Póliza de soporte',
    fields: [
      { key: 'type', label: 'Tipo de soporte', type: 'select', options: ['Comprado', 'En renta'] },
      { key: 'name', label: 'Nombre del programa', placeholder: 'Ej. Business One', required: true },
      { key: 'version', label: 'Versión', placeholder: 'Ej. 2026' },
      { key: 'provider', label: 'Proveedor', placeholder: 'Nombre del proveedor' },
      { key: 'area', label: 'Área', type: 'select', options: ['Almacén', 'Calidad', 'Comercial', 'Compras', 'Finanzas', 'Mantenimiento', 'Moldes', 'Producción', 'Recursos Humanos', 'Sistemas'] },
      { key: 'installationDate', label: 'Fecha de instalación', type: 'date' },
      { key: 'assignedTo', label: 'Responsable', placeholder: 'Nombre del responsable' },
      { key: 'serial', label: 'Serie', placeholder: 'Número de serie' },
      { key: 'code', label: 'Código', placeholder: 'Código del programa o póliza' },
      { key: 'licenseCount', label: 'Número de licencias', type: 'number', placeholder: '1' },
      { key: 'contact', label: 'Contacto', placeholder: 'Nombre del contacto' },
      { key: 'email', label: 'Email', type: 'email', placeholder: 'contacto@empresa.com' },
      { key: 'expiration', label: 'Fecha de vencimiento', type: 'date' },
      { key: 'status', label: 'Estado', type: 'select', options: ['Vigente', 'Por vencer', 'Vencida'] },
    ],
  },
  Articulos: {
    collection: 'articulos',
    label: 'Artículo de inventario',
    fields: [
      { key: 'name', label: 'Nombre del artículo', placeholder: 'Ej. Teclado USB', required: true },
      { key: 'type', label: 'Categoría', type: 'select', options: ['Accesorio', 'Consumible', 'Mobiliario', 'Refacción'] },
      { key: 'area', label: 'Área', type: 'select', options: ['Almacén', 'Calidad', 'Comercial', 'Compras', 'Finanzas', 'Mantenimiento', 'Moldes', 'Producción', 'Recursos Humanos', 'Sistemas'] },
      { key: 'quantity', label: 'Cantidad', type: 'number', placeholder: '0' },
      { key: 'status', label: 'Estado', type: 'select', options: ['Disponible', 'Asignado', 'Agotado'] },
      { key: 'Asignado a', label: 'Asignado a', placeholder: 'Nombre del usuario asignado' },
    ],
  },
  Configuración: {
    collection: 'configuracion',
    label: 'Configuración del sistema',
    fields: [
      { key: 'name', label: 'Configuración', placeholder: 'Ej. Correo de soporte', required: true },
      { key: 'type', label: 'Tipo', type: 'select', options: ['General', 'Notificaciones', 'Mantenimiento', 'Seguridad'] },
      { key: 'value', label: 'Valor', placeholder: 'Valor de la configuración', required: true },
      { key: 'notes', label: 'Descripción', placeholder: 'Notas de configuración' },
    ],
  },
};

function InventorySystem() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentType, setNewEquipmentType] = useState('PC de escritorio');
  const [newEquipmentArea, setNewEquipmentArea] = useState('');
  const [newEquipmentSpecs, setNewEquipmentSpecs] = useState({});
  const [isSavingEquipment, setIsSavingEquipment] = useState(false);
  const [recoveredList, setRecoveredList] = useState([]);
  const [recoveredSearch, setRecoveredSearch] = useState('');
  const [showRecoveredForm, setShowRecoveredForm] = useState(false);
  const [newRecovered, setNewRecovered] = useState({ name: '', type: 'Laptop', area: '', action: 'Reparado', condition: 'Operativo', notes: '' });
  const [softwareList, setSoftwareList] = useState([]);
  const [softwareSearch, setSoftwareSearch] = useState('');
  const [selectedSoftwareId, setSelectedSoftwareId] = useState(null);
  const [showSoftwareForm, setShowSoftwareForm] = useState(false);
  const [newSoftware, setNewSoftware] = useState({ name: '', type: 'Suscripción', version: '', provider: '', area: '', expiration: '' });
  const [genericLists, setGenericLists] = useState({});
  const [genericSearch, setGenericSearch] = useState('');
  const [showGenericForm, setShowGenericForm] = useState(false);
  const [genericForm, setGenericForm] = useState({});
  const [firebaseStatus, setFirebaseStatus] = useState('Conectando con Firebase...');
  const isHome = activeTab === 'inicio';
  const specFields = newEquipmentType === 'Monitor'
    ? ['Pantalla', 'Resolución', 'Conexiones', 'Asignado a']
    : ['Procesador', 'Memoria RAM', 'Disco duro o SSD', 'Sistema'];
  const visibleEquipment = equipmentList.filter((item) => {
    const searchableText = `${item.id} ${item.name} ${item.type} ${item.area}`.toLowerCase();
    return searchableText.includes(equipmentSearch.toLowerCase());
  });
  const visibleSoftware = softwareList.filter((item) => {
    const searchableText = `${item.id} ${item.name} ${item.type} ${item.version} ${item.provider} ${item.area}`.toLowerCase();
    return searchableText.includes(softwareSearch.toLowerCase());
  });
  const visibleRecovered = recoveredList.filter((item) => {
    const searchableText = `${item.id} ${item.name} ${item.type} ${item.area} ${item.action}`.toLowerCase();
    return searchableText.includes(recoveredSearch.toLowerCase());
  });
  const activeGenericConfig = genericSectionConfig[activeTab];
  const activeGenericList = activeGenericConfig ? (genericLists[activeTab] || []) : [];
  const visibleGeneric = activeGenericList.filter((item) => {
    const searchableText = Object.values(item).join(' ').toLowerCase();
    return searchableText.includes(genericSearch.toLowerCase());
  });
  const totalEquipment = equipmentList.length;
  const availableEquipment = equipmentList.filter((item) => item.status === 'Disponible').length;
  const activeEquipment = equipmentList.filter((item) => item.status === 'En uso' || item.status === 'Operativo').length;
  const defectiveEquipment = equipmentList.filter((item) => ['Dañado', 'Defectuoso'].includes(item.status)).length;
  const percentage = (value) => totalEquipment ? Math.round((value / totalEquipment) * 100) : 0;
  const typeDistributionBase = [
    { label: 'Equipo de computo', value: equipmentList.length, color: '#0f766e', className: 'dot-teal' },
    { label: 'Telefonía', value: (genericLists.Telefonia || []).length, color: '#ea580c', className: 'dot-orange' },
    { label: 'Impresoras', value: (genericLists.Impresoras || []).length, color: '#c026d3', className: 'dot-fuchsia' },
  ];
  const otherInventoryCount = softwareList.length + recoveredList.length + Object.entries(genericLists)
    .filter(([sectionKey]) => !['Telefonia', 'Impresoras'].includes(sectionKey))
    .reduce((total, [, records]) => total + records.length, 0);
  const typeDistribution = [
    ...typeDistributionBase,
    { label: 'Otros', value: otherInventoryCount, color: '#475569', className: 'dot-slate' },
  ];
  const typeDistributionTotal = typeDistribution.reduce((total, item) => total + item.value, 0);
  let typeDistributionOffset = 0;
  const donutStops = typeDistribution.map((item) => {
    const start = typeDistributionTotal ? (typeDistributionOffset / typeDistributionTotal) * 100 : 0;
    typeDistributionOffset += item.value;
    const end = typeDistributionTotal ? (typeDistributionOffset / typeDistributionTotal) * 100 : 0;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');
  const dashboardMetrics = [
    { label: 'Equipos activos', value: totalEquipment, tone: 'blue' },
    { label: 'Dañados', value: defectiveEquipment, tone: 'amber' },
    { label: 'En uso', value: activeEquipment, tone: 'green' },
    { label: 'Disponibles', value: availableEquipment, tone: 'violet' },
  ];
  const dashboardBars = [
    { label: 'Activos', value: percentage(totalEquipment), tone: 'blue' },
    { label: 'En uso', value: percentage(activeEquipment), tone: 'green' },
    { label: 'Disponibles', value: percentage(availableEquipment), tone: 'violet' },
    { label: 'Dañados', value: percentage(defectiveEquipment), tone: 'amber' },
  ];
  const getLicenseStatus = (expiration, currentStatus = 'Vigente') => {
    if (!expiration) return currentStatus === 'Vencida' ? 'Vigente' : currentStatus;

    const today = new Date();
    const expirationDate = new Date(`${expiration}T23:59:59`);
    const daysUntilExpiration = Math.ceil((expirationDate - today) / 86400000);
    if (daysUntilExpiration < 0) return 'Vencida';
    if (currentStatus === 'Próxima a vencer') return 'Próxima a vencer';
    if (daysUntilExpiration <= 30) return 'Próxima a vencer';
    return currentStatus === 'Vencida' ? 'Vigente' : currentStatus;
  };

  useEffect(() => {
    const cargarDesdeFirebase = async () => {
      if (!db || !firestoreGetDocs || !firestoreCollection) {
        setFirebaseStatus('Firebase no está disponible');
        return;
      }

      setFirebaseStatus('Firebase listo; cargando datos...');

      try {
        const equiposSnapshot = await firestoreGetDocs(firestoreCollection(db, 'equipos'));
        const equipos = equiposSnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            name: data.name || data.nombre || '',
            type: data.type || data.tipo || '',
            status: data.status || data.Estado || data.estado || 'Disponible',
            specs: data.specs || {
              Procesador: data.Procesador || data.procesador || '',
              'Memoria RAM': data['Memoria RAM'] || data.memoriaRAM || '',
              'Disco Duro': data['DiscoDuro'] || data.discoDuro || '',
              Sistema: data.Sistema || data.sistema || '',
            },
          };
        });
        setEquipmentList(equipos);
        setFirebaseStatus(`${equipos.length} equipos cargados desde Firebase; cargando el resto...`);

        const licenciasSnapshot = await firestoreGetDocs(firestoreCollection(db, 'Licencias'));
        const licencias = licenciasSnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            name: data.name || data.nombre || data.Nombre || '',
            type: data.type || data.tipo || data.Tipo || '',
            status: getLicenseStatus(data.expiration || data['Fecha de vencimiento'] || data['fecha de vencimiento'] || '', data.status || data.Estado || data.estado || 'Vigente'),
            provider: data.provider || data.Proveedor || data.proveedor || data['asignado a'] || '',
            expiration: data.expiration || data['Fecha de vencimiento'] || data['fecha de vencimiento'] || '',
            area: data.area || data.Área || data['Área asignada'] || '',
          };
        });
        setSoftwareList(licencias);
        licencias.forEach((license) => {
          if (license.status === 'Vencida' || license.status === 'Próxima a vencer') {
            firestoreSetDoc(firestoreDoc(db, 'Licencias', license.id), { status: license.status }, { merge: true }).catch((error) => {
              console.warn('No se pudo actualizar automáticamente la licencia vencida:', error);
            });
          }
        });

        const recuperadosSnapshot = await firestoreGetDocs(firestoreCollection(db, 'recuperados'));
        const recuperados = recuperadosSnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            name: data.name || data.nombre || '',
            type: data.type || data.tipo || '',
            condition: data.condition || data.condicion || 'Operativo',
            
          };
        });
        setRecoveredList(recuperados);

        const genericEntries = await Promise.all(Object.entries(genericSectionConfig).map(async ([sectionKey, config]) => {
          const snapshot = await firestoreGetDocs(firestoreCollection(db, config.collection));
          const records = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            if (sectionKey !== 'Impresoras') {
              return {
                id: docSnap.id,
                ...data,
                ...(sectionKey === 'noFuncionales' ? { status: data.status || 'Activo' } : {}),
              };
            }
            return {
              id: docSnap.id,
              ...data,
              impresiones: Number(data.impresiones ?? 0),
              toner: data.toner || {
                magenta: Number(data.tonerMagenta ?? 0),
                negro: Number(data.tonerBlack ?? 0),
                cian: Number(data.tonerCyan ?? 0),
                amarillo: Number(data.tonerYellow ?? 0),
              },
            };
          });
          return [sectionKey, records];
        }));
        setGenericLists(Object.fromEntries(genericEntries));
        setFirebaseStatus('Firebase conectado');
      } catch (error) {
        console.error('Error al conectar Firebase:', error);
        setFirebaseStatus(`Error de Firebase: ${error?.code || error?.message || 'desconocido'}`);
        alert('No se pudo conectar Firebase. Revisa tu configuración.');
      }
    };

    cargarDesdeFirebase();
  }, []);

  const handleAddEquipment = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    if (!newEquipmentName.trim()) return;
    if (!db || !firestoreSetDoc || !firestoreDoc) {
      alert('Firebase no está disponible. Recarga la página con Ctrl + F5.');
      return;
    }
    setIsSavingEquipment(true);
    setFirebaseStatus('Guardando equipo en Firebase...');

    const newEquipment = {
      id: `EQ-${String(equipmentList.length + 1).padStart(3, '0')}`,
      name: newEquipmentName.trim(),
      type: newEquipmentType,
      status: 'Disponible',
      area: newEquipmentArea.trim() || 'Sin asignar',
      specs: Object.fromEntries(specFields.map((field) => [field, (newEquipmentSpecs[field] || '').trim()]))
    };
    const equipmentDocument = {
      id: newEquipment.id,
      name: newEquipment.name,
      type: newEquipment.type,
      status: newEquipment.status,
      area: newEquipment.area,
      ...newEquipment.specs,
      fechaRegistro: new Date().toISOString(),
    };

    try {
      const equipmentReference = firestoreDoc(db, 'equipos', newEquipment.id);
      await firestoreSetDoc(equipmentReference, equipmentDocument);
      const savedEquipment = firestoreGetDoc ? await firestoreGetDoc(equipmentReference) : null;
      if (savedEquipment && !savedEquipment.exists) {
        throw new Error('Firestore no confirmó el documento guardado.');
      }

      setEquipmentList((currentEquipment) => [...currentEquipment, newEquipment]);
      setNewEquipmentName('');
      setNewEquipmentArea('');
      setNewEquipmentSpecs({});
      setShowEquipmentForm(false);
      setSelectedEquipmentId(newEquipment.id);
      setFirebaseStatus(`Equipo ${newEquipment.id} guardado en Firestore`);
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      const detail = error?.code ? ` (${error.code})` : '';
      const message = error?.message || 'Error desconocido';
      setFirebaseStatus(`Error al guardar equipo${detail}`);
      alert(`No se pudo guardar el equipo${detail}: ${message}`);
    } finally {
      setIsSavingEquipment(false);
    }
  };

  const handleRetireEquipment = async (equipmentId = selectedEquipmentId) => {
    if (!equipmentId || !db || !firestoreDeleteDoc || !firestoreDoc) return;

    try {
      await firestoreDeleteDoc(firestoreDoc(db, 'equipos', equipmentId));
      setEquipmentList((currentEquipment) => currentEquipment.filter((item) => item.id !== equipmentId));
      setSelectedEquipmentId(null);
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      alert('No se pudo eliminar el equipo.');
    }
  };

  const handleChangeEquipmentStatus = async (equipmentId, status) => {
    if (!equipmentId || !db || !firestoreSetDoc || !firestoreDoc) return;

    const previousEquipment = equipmentList.find((item) => item.id === equipmentId);
    setEquipmentList((currentEquipment) => currentEquipment.map((item) => item.id === equipmentId ? { ...item, status } : item));

    try {
      await firestoreSetDoc(firestoreDoc(db, 'equipos', equipmentId), { status }, { merge: true });
      setFirebaseStatus(`Estado de ${equipmentId} actualizado a ${status}`);
    } catch (error) {
      setEquipmentList((currentEquipment) => currentEquipment.map((item) => item.id === equipmentId ? previousEquipment : item));
      console.error('Error al actualizar estado del equipo:', error);
      const detail = error?.code ? ` (${error.code})` : '';
      setFirebaseStatus(`Error al actualizar estado${detail}`);
      alert(`No se pudo actualizar el estado${detail}.`);
    }
  };

  const handleRecoveredChange = (field, value) => {
    setNewRecovered((currentRecovered) => ({ ...currentRecovered, [field]: value }));
  };

  const handleAddRecovered = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    if (!newRecovered.name.trim()) return;
    if (!db || !firestoreSetDoc || !firestoreDoc) {
      alert('Firebase no está disponible. Recarga la página con Ctrl + F5.');
      return;
    }

    const recovered = {
      id: `REC-${String(recoveredList.length + 1).padStart(3, '0')}`,
      name: newRecovered.name.trim(),
      type: newRecovered.type,
      area: newRecovered.area.trim() || 'Sin asignar',
      action: newRecovered.action,
      condition: newRecovered.condition,
      notes: newRecovered.notes.trim(),
      status: 'Recuperado',
    };

    try {
      await firestoreSetDoc(firestoreDoc(db, 'recuperados', recovered.id), {
        ...recovered,
        fechaRecuperacion: new Date().toISOString(),
      });
      setRecoveredList((currentRecovered) => [...currentRecovered, recovered]);
      setNewRecovered({ name: '', type: 'Laptop', area: '', action: 'Reparado', condition: 'Operativo', notes: '' });
      setShowRecoveredForm(false);
      setFirebaseStatus('Equipo recuperado guardado correctamente');
    } catch (error) {
      console.error('Error al guardar equipo recuperado:', error);
      const detail = error?.code ? ` (${error.code})` : '';
      setFirebaseStatus(`Error al guardar recuperado${detail}`);
      alert(`No se pudo guardar el equipo recuperado${detail}. Revisa las reglas de Firestore.`);
    }
  };

  const handleDeleteRecovered = async (recoveredId) => {
    if (!recoveredId || !db || !firestoreDeleteDoc || !firestoreDoc) return;

    try {
      await firestoreDeleteDoc(firestoreDoc(db, 'recuperados', recoveredId));
      setRecoveredList((currentRecovered) => currentRecovered.filter((item) => item.id !== recoveredId));
    } catch (error) {
      console.error('Error al eliminar equipo recuperado:', error);
      alert('No se pudo eliminar el equipo recuperado.');
    }
  };

  const handleSoftwareChange = (field, value) => {
    setNewSoftware((currentSoftware) => ({ ...currentSoftware, [field]: value }));
  };

  const handleGenericChange = (field, value) => {
    setGenericForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleAddGeneric = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    if (!activeGenericConfig || !genericForm.name?.trim()) return;
    if (!db || !firestoreSetDoc || !firestoreDoc) {
      alert('Firebase no está disponible. Recarga la página con Ctrl + F5.');
      return;
    }

    const recordId = `${activeTab.toUpperCase().slice(0, 3)}-${String(activeGenericList.length + 1).padStart(3, '0')}`;
    const record = {
      id: recordId,
      ...genericForm,
      name: genericForm.name.trim(),
      status: genericForm.status || 'Activo',
    };
    if (activeTab === 'Impresoras') {
      record.impresiones = 0;
      record.toner = {
        magenta: Math.max(0, Math.min(100, Number(genericForm.tonerMagenta || 0))),
        negro: Math.max(0, Math.min(100, Number(genericForm.tonerBlack || 0))),
        cian: Math.max(0, Math.min(100, Number(genericForm.tonerCyan || 0))),
        amarillo: Math.max(0, Math.min(100, Number(genericForm.tonerYellow || 0))),
      };
    }

    try {
      await firestoreSetDoc(firestoreDoc(db, activeGenericConfig.collection, recordId), {
        ...record,
        fechaRegistro: new Date().toISOString(),
      });
      setGenericLists((currentLists) => ({
        ...currentLists,
        [activeTab]: [...(currentLists[activeTab] || []), record],
      }));
      setGenericForm({});
      setShowGenericForm(false);
      setFirebaseStatus('Registro guardado correctamente');
    } catch (error) {
      console.error(`Error al guardar registro de ${activeTab}:`, error);
      const detail = error?.code ? ` (${error.code})` : '';
      setFirebaseStatus(`Error al guardar registro${detail}`);
      alert(`No se pudo guardar el registro${detail}. Revisa las reglas de Firestore.`);
    }
  };

  const handlePrint = async (printer) => {
    if (!printer?.id || !db || !firestoreSetDoc || !firestoreDoc) return;

    const currentToner = printer.toner || { magenta: 0, negro: 0, cian: 0, amarillo: 0 };
    const toner = Object.fromEntries(Object.entries(currentToner).map(([color, level]) => [color, Math.max(0, Number(level || 0) - 1)]));
    const updatedPrinter = { ...printer, toner };
    delete updatedPrinter.tonerMagenta;
    delete updatedPrinter.tonerBlack;
    delete updatedPrinter.tonerCyan;
    delete updatedPrinter.tonerYellow;

    try {
      await firestoreSetDoc(firestoreDoc(db, 'impresoras', printer.id), {
        ...updatedPrinter,
        impresiones: Number(printer.impresiones || 0) + 1,
        ultimaImpresion: new Date().toISOString(),
      });
      setGenericLists((currentLists) => ({
        ...currentLists,
        Impresoras: (currentLists.Impresoras || []).map((item) => item.id === printer.id ? { ...item, ...updatedPrinter, impresiones: Number(printer.impresiones || 0) + 1 } : item),
      }));
      setFirebaseStatus('Impresión registrada y tóner actualizado');
    } catch (error) {
      console.error('Error al registrar impresión:', error);
      const detail = error?.code ? ` (${error.code})` : '';
      setFirebaseStatus(`Error al registrar impresión${detail}`);
      alert(`No se pudo registrar la impresión${detail}.`);
    }
  };

  const handleDeleteGeneric = async (recordId) => {
    if (!activeGenericConfig || !recordId || !db || !firestoreDeleteDoc || !firestoreDoc) return;

    try {
      await firestoreDeleteDoc(firestoreDoc(db, activeGenericConfig.collection, recordId));
      setGenericLists((currentLists) => ({
        ...currentLists,
        [activeTab]: (currentLists[activeTab] || []).filter((item) => item.id !== recordId),
      }));
    } catch (error) {
      console.error(`Error al eliminar registro de ${activeTab}:`, error);
      alert('No se pudo eliminar el registro.');
    }
  };

  const handleChangeDefectiveStatus = async (recordId, status) => {
    if (!recordId || !db || !firestoreSetDoc || !firestoreDoc) return;

    const previousRecord = (genericLists.noFuncionales || []).find((item) => item.id === recordId);
    setGenericLists((currentLists) => ({
      ...currentLists,
      noFuncionales: (currentLists.noFuncionales || []).map((item) => item.id === recordId ? { ...item, status } : item),
    }));

    try {
      await firestoreSetDoc(firestoreDoc(db, 'defectuosos', recordId), { status }, { merge: true });
      setFirebaseStatus(`Equipo dañado ${recordId} actualizado a ${status}`);
    } catch (error) {
      setGenericLists((currentLists) => ({
        ...currentLists,
        noFuncionales: (currentLists.noFuncionales || []).map((item) => item.id === recordId ? previousRecord : item),
      }));
      console.error('Error al actualizar estado del equipo dañado:', error);
      alert('No se pudo actualizar el estado del equipo dañado.');
    }
  };

  const handleChangeAreaStatus = async (recordId, status) => {
    if (!recordId || !db || !firestoreSetDoc || !firestoreDoc) return;

    const previousRecord = (genericLists.porArea || []).find((item) => item.id === recordId);
    setGenericLists((currentLists) => ({
      ...currentLists,
      porArea: (currentLists.porArea || []).map((item) => item.id === recordId ? { ...item, status } : item),
    }));

    try {
      await firestoreSetDoc(firestoreDoc(db, 'equiposPorArea', recordId), { status }, { merge: true });
      setFirebaseStatus(`Equipo por área ${recordId} actualizado a ${status}`);
    } catch (error) {
      setGenericLists((currentLists) => ({
        ...currentLists,
        porArea: (currentLists.porArea || []).map((item) => item.id === recordId ? previousRecord : item),
      }));
      console.error('Error al actualizar estado del equipo por área:', error);
      alert('No se pudo actualizar el estado del equipo por área.');
    }
  };

  const handleAddSoftware = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    if (!newSoftware.name.trim()) return;
    if (!db || !firestoreSetDoc || !firestoreDoc) {
      alert('Firebase no está disponible. Recarga la página con Ctrl + F5.');
      return;
    }

    const software = {
      id: `SW-${String(softwareList.length + 1).padStart(3, '0')}`,
      name: newSoftware.name.trim(),
      type: newSoftware.type,
      version: newSoftware.version.trim(),
      provider: newSoftware.provider.trim(),
      area: newSoftware.area,
      expiration: newSoftware.expiration,
      status: getLicenseStatus(newSoftware.expiration, 'Vigente')
    };

    try {
      await firestoreSetDoc(firestoreDoc(db, 'Licencias', software.id), {
        ...software,
        fechaRegistro: new Date().toISOString(),
      });

      setSoftwareList((currentSoftware) => [...currentSoftware, software]);
      setNewSoftware({ name: '', type: 'Suscripción', version: '', provider: '', area: '', expiration: '' });
      setShowSoftwareForm(false);
      setSelectedSoftwareId(software.id);
      setFirebaseStatus('Licencia guardada correctamente');
    } catch (error) {
      console.error('Error al guardar licencia:', error);
      const detail = error?.code ? ` (${error.code})` : '';
      setFirebaseStatus(`Error al guardar licencia${detail}`);
      alert(`No se pudo guardar la licencia${detail}. Revisa las reglas de Firestore.`);
    }
  };

  const handleRetireSoftware = async (softwareId = selectedSoftwareId) => {
    if (!softwareId || !db || !firestoreDeleteDoc || !firestoreDoc) return;

    try {
      await firestoreDeleteDoc(firestoreDoc(db, 'Licencias', softwareId));
      setSoftwareList((currentSoftware) => currentSoftware.filter((item) => item.id !== softwareId));
      setSelectedSoftwareId(null);
    } catch (error) {
      console.error('Error al eliminar licencia:', error);
      alert('No se pudo eliminar la licencia.');
    }
  };

  const handleChangeSoftwareStatus = async (softwareId, status) => {
    if (!softwareId || !db || !firestoreSetDoc || !firestoreDoc) return;

    const license = softwareList.find((item) => item.id === softwareId);
    const nextStatus = getLicenseStatus(license?.expiration, status);
    setSoftwareList((currentSoftware) => currentSoftware.map((item) => item.id === softwareId ? { ...item, status: nextStatus } : item));

    try {
      await firestoreSetDoc(firestoreDoc(db, 'Licencias', softwareId), { status: nextStatus }, { merge: true });
      setFirebaseStatus(`Licencia ${softwareId} actualizada a ${nextStatus}`);
    } catch (error) {
      setSoftwareList((currentSoftware) => currentSoftware.map((item) => item.id === softwareId ? license : item));
      console.error('Error al actualizar estado de licencia:', error);
      alert('No se pudo actualizar el estado de la licencia.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-600 px-6 py-4 text-white shadow-md">
        <h1 className="text-2xl font-bold">menshen</h1>
      </header>
      <div className={`firebase-status ${firebaseStatus.startsWith('Error') || firebaseStatus.includes('no está') ? 'firebase-status-error' : ''}`} role="status">
        <span className="firebase-status-dot" />
        {firebaseStatus}
      </div>
      <main className="flex-1 p-6 overflow-y-auto pt-28 pb-6">
        <div className="max-w-5xl mx-auto">
          <header className="page-header mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {inventoryData[activeTab].icon}
              {inventoryData[activeTab].title}
            </h1>
            {inventoryData[activeTab].desc && (
              <p className="mt-3 text-sm text-gray-700">{inventoryData[activeTab].desc}</p>
            )}
          </header>

          {isHome ? (
            <section className="home-shell">
              <div className="home-hero">
                <div className="hero-copy">
                  <span className="home-label">Resumen general</span>
                  <h2>Estado operativo del área de TI</h2>
                  <p>
                    Puedes monitorear el estado de los equipos, revisar ckecklist de mantenimiento y
                    revisar rápidamente la operación del inventario.
                  </p>
                </div>

                <div className="hero-stats">
                  {dashboardMetrics.map((metric) => (
                    <div key={metric.label} className={`metric-card metric-${metric.tone}`}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-visuals">
                <article className="chart-card status-chart-card">
                  <div className="chart-heading">
                    <div>
                      <span className="chart-kicker">Indicadores</span>
                      <h3>Estados de los equipos</h3>
                    </div>
                    <span className="chart-period">Este mes</span>
                  </div>
                  <div className="bar-chart" aria-label="Gráfico de estado de los equipos">
                    {dashboardBars.map((item) => (
                      <div className="bar-item" key={item.label}>
                        <div className="bar-value">{item.value}%</div>
                        <div className="bar-track"><div className={`bar-fill bar-${item.tone}`} style={{ height: `${item.value}%` }} /></div>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="chart-card asset-mix-card">
                  <div className="chart-heading">
                    <div>
                      <span className="chart-kicker">Inventario</span>
                      <h3>Distribución por tipo  </h3>
                    </div>
                  </div>
                  <div className="mix-content">
                    <div className="donut-chart" style={{ background: typeDistributionTotal ? `conic-gradient(${donutStops})` : '#e2e8f0' }} aria-label="Distribución del inventario por tipo">
                      <span>{typeDistributionTotal}<small>registros</small></span>
                    </div>
                    <div className="legend-list">
                      {typeDistribution.map((item) => (
                        <div key={item.label} title={`${item.label}: ${item.value} ${item.value === 1 ? 'equipo' : 'equipos'}`}>
                          <i className={`legend-dot ${item.className}`} style={{ backgroundColor: item.color }} />
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>

              <div className="home-grid">
                {inventoryData[activeTab].content.map((item, index) => (
                  <div key={item.id || `${item.name}-${index}`} className="feature-card">
                    <div className="feature-badge">{item.id}</div>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : (





            <>
              {activeTab === 'computadoras' && (
                <section className="equipment-actions" aria-label="Acciones del inventario de equipos">
                  <div className="equipment-action-heading">
                    <div>
                      <span className="chart-kicker">Inventario de hardware</span>
                      <h2>Equipos registrados</h2>
                    </div>
                    <span className="equipment-count">{visibleEquipment.length} equipos</span>
                  </div>
                  <div className="equipment-action-row">
                    <label className="equipment-search">
                      <Search />
                      <span className="sr-only">Buscar equipos</span>
                      <input
                        type="search"
                        value={equipmentSearch}
                        onChange={(event) => setEquipmentSearch(event.target.value)}
                        placeholder="Buscar por nombre, ID, tipo o área"
                      />
                    </label>
                    <button type="button" className="equipment-action-button button-primary" onClick={() => setShowEquipmentForm((isOpen) => !isOpen)}>
                      <Plus /> Agregar equipo
                    </button>
                  </div>
                  {showEquipmentForm && (
                    <form className="equipment-form" onSubmit={handleAddEquipment}>
                      <div className="equipment-form-header">
                        <div>
                          <span className="chart-kicker">Nuevo registro</span>
                          <h3>Información del equipo</h3>
                        </div>
                        <span className="equipment-form-required">* Campos obligatorios</span>
                      </div>
                      <div className="equipment-form-fields">
                        <label className="equipment-form-field">
                          <span>Nombre o modelo <b>*</b></span>
                          <input value={newEquipmentName} onChange={(event) => setNewEquipmentName(event.target.value)} placeholder="Ej. Dell Opti 7090" required />
                        </label>
                        <label className="equipment-form-field">
                          <span>Tipo de equipo <b>*</b></span>
                          <select value={newEquipmentType} onChange={(event) => setNewEquipmentType(event.target.value)} required>
                            <option>Selecciona una opción</option>
                            <option>Laptop</option>
                            <option>Tablet</option>
                            <option>Monitor</option>
                          </select>
                        </label>
                        <label className="equipment-form-field">
                          <span>Área asignada <b>*</b></span>
                          <select value={newEquipmentArea} onChange={(event) => setNewEquipmentArea(event.target.value)} required>
                            <option value="">Selecciona un área</option>
                            <option>Almacén</option>
                            <option>Calidad</option>
                            <option>Comercial</option>
                            <option>Compras</option>
                            <option>Finanzas</option>
                            <option>Mantenimiento</option>
                            <option>Moldes</option>
                            <option>Producción</option>
                            <option>Recursos Humanos</option>
                            <option>Sistemas</option>
                          </select>
                        </label>
                      </div>
                      <div className="equipment-spec-form-fields">
                        <div className="equipment-spec-heading">
                          <div>
                            <span className="chart-kicker">Ficha técnica</span>
                            <p>Especificaciones del equipo</p>
                          </div>
                          <span>{newEquipmentType}</span>
                        </div>
                        {specFields.map((field) => (
                          <label className="equipment-form-field" key={field}>
                            <span>{field} <b>*</b></span>
                            <input
                              value={newEquipmentSpecs[field] || ''}
                              onChange={(event) => setNewEquipmentSpecs((currentSpecs) => ({ ...currentSpecs, [field]: event.target.value }))}
                              placeholder={`${field.toLowerCase()}`}
                              required
                            />
                          </label>
                        ))}
                      </div>
                      <div className="equipment-form-footer">
                        <p>El equipo se registrará inicialmente con estado <strong>Disponible</strong>.</p>
                        <button type="submit" className="equipment-form-submit" disabled={isSavingEquipment}><Plus /> {isSavingEquipment ? 'Guardando...' : 'Guardar equipo'}</button>
                      </div>
                    </form>
                    
                  )}
                </section>
              )}
              //parte de las licencias
              
              {activeTab === 'licencias' && (
                <section className="equipment-actions" aria-label="Acciones del inventario de software y licencias">
                  <div className="equipment-action-heading">
                    <div>
                      <span className="chart-kicker">Inventario de software Licencias </span>
                      <h2>Licencias registradas</h2>
                    </div>
                    <span className="equipment-count">{visibleSoftware.length} licencias</span>
                  </div>
                  <div className="equipment-action-row">
                    <label className="equipment-search">
                      <Search />
                      <span className="sr-only">Buscar software</span>
                      <input
                        type="search"
                        value={softwareSearch}
                        onChange={(event) => setSoftwareSearch(event.target.value)}
                        placeholder="Buscar por nombre, versión, proveedor o área"
                      />
                    </label>
                    <button type="button" className="equipment-action-button button-primary" onClick={() => setShowSoftwareForm((isOpen) => !isOpen)}>
                      <Plus /> Agregar licencia
                    </button>
                  </div>
                  {showSoftwareForm && (
                    <form className="equipment-form" onSubmit={handleAddSoftware}>
                      <div className="equipment-form-header">
                        <div>
                          <span className="chart-kicker">Nuevo registro</span>
                          <h3>Información de las licencias</h3>
                        </div>
                        <span className="equipment-form-required">* Campos obligatorios</span>
                      </div>
                      <div className="equipment-form-fields">
                        <label className="equipment-form-field">
                          <span>Nombre del software <b>*</b></span>
                          <input value={newSoftware.name} onChange={(event) => handleSoftwareChange('name', event.target.value)} placeholder="Ej. Microsoft 365" required />
                        </label>
                        <label className="equipment-form-field">
                          <span>Tipo de licencia <b>*</b></span>
                          <select value={newSoftware.type} onChange={(event) => handleSoftwareChange('type', event.target.value)} required>
                            <option>Selecciona una opción</option>
                             <option>Suscripción</option>
                            <option>Perpetua</option>
                            <option>Open source</option>
                            <option>Prueba</option>
                          </select>
                        </label>
                        <label className="equipment-form-field">
                          <span>Versión <b>*</b></span>
                          <input value={newSoftware.version} onChange={(event) => handleSoftwareChange('version', event.target.value)} placeholder="Ej. 2026" required />
                        </label>
                        <label className="equipment-form-field">
                          <span>Proveedor <b>*</b></span>
                          <input value={newSoftware.provider} onChange={(event) => handleSoftwareChange('provider', event.target.value)} placeholder="Ej. Microsoft" required />
                        </label>
                        <label className="equipment-form-field">
                          <span>Área asignada <b>*</b></span>
                          <select value={newSoftware.area} onChange={(event) => handleSoftwareChange('area', event.target.value)} required>
                            <option value="">Selecciona un área</option>
                            <option>Almacén</option>
                            <option>Calidad</option>
                            <option>Comercial</option>
                            <option>Compras</option>
                            <option>Finanzas</option>
                            <option>Mantenimiento</option>
                            <option>Producción</option>
                            <option>Recursos Humanos</option>
                            <option>Sistemas</option>
                          </select>
                        </label>
                        <label className="equipment-form-field">
                          <span>Fecha de vencimiento</span>
                          <input type="date" value={newSoftware.expiration} onChange={(event) => handleSoftwareChange('expiration', event.target.value)} />
                        </label>
                      </div>
                      <div className="equipment-form-footer">
                        <p>La licencia se registrará inicialmente con estado <strong>Vigente</strong>.</p>
                        <button type="submit" className="equipment-form-submit"><Plus /> Guardar licencia</button>
                      </div>
                    </form>
                  )}
                </section>
              )}
              {activeTab === 'recuperados' && (
                <section className="equipment-actions" aria-label="Acciones de equipos recuperados">
                  <div className="equipment-action-heading">
                    <div>
                      <span className="chart-kicker">Historial de recuperación</span>
                      <h2>Equipos recuperados</h2>
                    </div>
                    <span className="equipment-count">{visibleRecovered.length} equipos</span>
                  </div>
                  <div className="equipment-action-row">
                    <label className="equipment-search">
                      <Search />
                      <span className="sr-only">Buscar equipos recuperados</span>
                      <input type="search" value={recoveredSearch} onChange={(event) => setRecoveredSearch(event.target.value)} placeholder="Buscar por nombre, ID, tipo o acción" />
                    </label>
                    <button type="button" className="equipment-action-button button-primary" onClick={() => setShowRecoveredForm((isOpen) => !isOpen)}>
                      <Plus /> Registrar recuperación
                    </button>
                  </div>
                  {showRecoveredForm && (
                    <form className="equipment-form" onSubmit={handleAddRecovered}>
                      <div className="equipment-form-header">
                        <div>
                          <span className="chart-kicker">Nuevo registro</span>
                          <h3>Información del equipo recuperado</h3>
                        </div>
                        <span className="equipment-form-required">* Campos obligatorios</span>
                      </div>
                      <div className="equipment-form-fields recovered-form-fields">
                        <label className="equipment-form-field"><span>Nombre o modelo <b>*</b></span><input value={newRecovered.name} onChange={(event) => handleRecoveredChange('name', event.target.value)} placeholder="Ej. Lenovo ThinkPad" required /></label>
                        <label className="equipment-form-field"><span>Tipo <b>*</b></span><select value={newRecovered.type} onChange={(event) => handleRecoveredChange('type', event.target.value)}><option>Laptop</option><option>PC de escritorio</option><option>Monitor</option><option>Tablet</option><option>Impresora</option></select></label>
                        <label className="equipment-form-field"><span>Área asignada</span><input value={newRecovered.area} onChange={(event) => handleRecoveredChange('area', event.target.value)} placeholder="Ej. Sistemas" /></label>
                        <label className="equipment-form-field"><span>Acción realizada <b>*</b></span><select value={newRecovered.action} onChange={(event) => handleRecoveredChange('action', event.target.value)}><option>Reparado</option><option>Reasignado</option><option>Vendido</option><option>Donado</option></select></label>
                        <label className="equipment-form-field"><span>Condición <b>*</b></span><select value={newRecovered.condition} onChange={(event) => handleRecoveredChange('condition', event.target.value)}><option>Operativo</option><option>En observación</option><option>Para refacciones</option></select></label>
                        <label className="equipment-form-field recovered-notes-field"><span>Notas</span><input value={newRecovered.notes} onChange={(event) => handleRecoveredChange('notes', event.target.value)} placeholder="Describe la recuperación" /></label>
                      </div>
                      <div className="equipment-form-footer">
                        <p>El equipo quedará guardado en la colección <strong>recuperados</strong>.</p>
                        <button type="submit" className="equipment-form-submit"><Plus /> Guardar recuperación</button>
                      </div>
                    </form>
                  )}
                </section>
              )}
              {activeGenericConfig && (
                <section className="equipment-actions" aria-label={`Acciones de ${activeGenericConfig.label}`}>
                  <div className="equipment-action-heading">
                    <div>
                      <span className="chart-kicker">Módulo</span>
                      <h2>{activeGenericConfig.label}</h2>
                    </div>
                    <span className="equipment-count">{visibleGeneric.length} registros</span>
                  </div>
                  <div className="equipment-action-row">
                    <label className="equipment-search">
                      <Search />
                      <span className="sr-only">Buscar registros</span>
                      <input type="search" value={genericSearch} onChange={(event) => setGenericSearch(event.target.value)} placeholder="Buscar en este apartado" />
                    </label>
                    <button type="button" className="equipment-action-button button-primary" onClick={() => setShowGenericForm((isOpen) => !isOpen)}>
                      <Plus /> Nuevo registro
                    </button>
                  </div>
                  {showGenericForm && (
                    <form className="equipment-form" onSubmit={handleAddGeneric}>
                      <div className="equipment-form-header">
                        <div>
                          <span className="chart-kicker">Nuevo registro</span>
                          <h3>{activeGenericConfig.label}</h3>
                        </div>
                        <span className="equipment-form-required">* Campos obligatorios</span>
                      </div>
                      <div className="equipment-form-fields generic-form-fields">
                        {activeGenericConfig.fields.map((field) => (
                          <label className="equipment-form-field" key={field.key}>
                            <span>{field.label} {field.required && <b>*</b>}</span>
                            {field.type === 'select' ? (
                              <select value={genericForm[field.key] || field.options[0]} onChange={(event) => handleGenericChange(field.key, event.target.value)}>
                                {field.options.map((option) => <option key={option}>{option}</option>)}
                              </select>
                            ) : (
                              <input type={field.type || 'text'} value={genericForm[field.key] || ''} onChange={(event) => handleGenericChange(field.key, event.target.value)} placeholder={field.placeholder} required={field.required} />
                            )}
                          </label>
                        ))}
                      </div>
                      <div className="equipment-form-footer">
                        <p>Los datos se guardarán en <strong>{activeGenericConfig.collection}</strong>.</p>
                        <button type="submit" className="equipment-form-submit"><Plus /> Guardar registro</button>
                      </div>
                    </form>
                  )}
                </section>
              )}
              <div className={`grid gap-4 md:grid-cols-2 ${activeTab === 'computadoras' ? 'equipment-grid' : ''} ${activeTab === 'licencias' ? 'software-grid' : ''}`}>
                {(activeTab === 'computadoras' ? visibleEquipment : activeTab === 'licencias' ? visibleSoftware : activeTab === 'recuperados' ? visibleRecovered : activeGenericConfig ? visibleGeneric : inventoryData[activeTab].content).map((item, index) => (
                  <InventoryCard
                    key={item.id || `${item.name}-${index}`}
                    item={item}
                    index={index}
                    activeTab={activeTab}
                    selectedEquipmentId={selectedEquipmentId}
                    selectedSoftwareId={selectedSoftwareId}
                    onSelectEquipment={setSelectedEquipmentId}
                    onSelectSoftware={setSelectedSoftwareId}
                    onRetireEquipment={handleRetireEquipment}
                    onChangeEquipmentStatus={handleChangeEquipmentStatus}
                    onRetireSoftware={handleRetireSoftware}
                    onChangeSoftwareStatus={handleChangeSoftwareStatus}
                    onChangeDefectiveStatus={handleChangeDefectiveStatus}
                    onChangeAreaStatus={handleChangeAreaStatus}
                    onDeleteRecovered={handleDeleteRecovered}
                    onDeleteGeneric={handleDeleteGeneric}
                    onPrint={handlePrint}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <InventoryNavigation inventoryData={inventoryData} activeTab={activeTab} onChange={setActiveTab} />
    </div>

    
  );
  
}


const rootElement = document.getElementById('root');
ReactDOM.createRoot ? ReactDOM.createRoot(rootElement).render(<InventorySystem />) : ReactDOM.render(<InventorySystem />, rootElement);