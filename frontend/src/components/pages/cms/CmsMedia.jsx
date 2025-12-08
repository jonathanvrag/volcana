import { useEffect, useRef, useState } from 'react';
import { fetchPlaylists } from '../../../api/playlists';
import {
  fetchMedia,
  createMedia,
  deleteMedia,
  uploadMediaFile,
  updateMedia,
} from '../../../api/media';
import CmsMediaForm from './CmsMediaForm';
import CmsMediaTable from './CmsMediaTable';
import CmsMediaPreviewModal from './CmsMediaPreviewModal';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

export default function CmsMedia() {
  const [playlists, setPlaylists] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const [playlistId, setPlaylistId] = useState('');
  const [type, setType] = useState('image');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [duration, setDuration] = useState(20);
  const [creating, setCreating] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const fileInputRef = useRef(null);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [pls, mediaItems] = await Promise.all([
        fetchPlaylists(),
        fetchMedia(),
      ]);
      setPlaylists(pls);
      setMedia(mediaItems);
      if (!playlistId && pls.length > 0) {
        setPlaylistId(String(pls[0].id));
      }
    } catch (err) {
      setError(err.message || 'Error cargando media');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!playlistId || !fileUrl.trim()) return;

    try {
      setCreating(true);
      setError('');
      await createMedia({
        playlist_id: Number(playlistId),
        type,
        title: title.trim() || null,
        description: null,
        file_url: fileUrl.trim(),
        duration_seconds: Number(duration) || 20,
        order_index: Number(orderIndex) || 0,
        active: true,
      });
      setTitle('');
      setFileUrl('');
      setOrderIndex(0);
      setDuration(20);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      await loadData();
    } catch (err) {
      setError(err.message || 'Error creando media');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este item?')) return;
    try {
      await deleteMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message || 'Error eliminando media');
    }
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const data = await uploadMediaFile(file);
      setFileUrl(data.file_url);
    } catch (err) {
      setError(err.message || 'Error subiendo archivo');
    } finally {
      setUploading(false);
    }
  }

  function handleLocalChange(id, field, value) {
    setMedia(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  }

  async function handleSave(id) {
    const item = media.find(m => m.id === id);
    if (!item) return;

    try {
      setSavingId(id);
      setError('');

      await updateMedia(id, {
        title: item.title || null,
        order_index: Number(item.order_index) || 0,
        duration_seconds: Number(item.duration_seconds) || 20,
        active: item.active,
      });

      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Error actualizando media');
    } finally {
      setSavingId(null);
    }
  }

  function getMediaSrc(fileUrlValue) {
    if (!fileUrlValue) return '';
    return fileUrlValue.startsWith('http')
      ? fileUrlValue
      : `${API_ORIGIN}${fileUrlValue}`;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold text-slate-800'>Media</h3>
        <p className='text-sm text-slate-600'>
          Gestiona las imágenes, videos y textos que componen los loops.
        </p>
      </div>

      {error && (
        <div className='rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700'>
          {error}
        </div>
      )}

      <CmsMediaForm
        playlists={playlists}
        playlistId={playlistId}
        setPlaylistId={setPlaylistId}
        type={type}
        setType={setType}
        title={title}
        setTitle={setTitle}
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
        orderIndex={orderIndex}
        setOrderIndex={setOrderIndex}
        duration={duration}
        setDuration={setDuration}
        creating={creating}
        uploading={uploading}
        onCreate={handleCreate}
        onFileSelect={handleFileSelect}
        fileInputRef={fileInputRef}
      />

      <CmsMediaTable
        playlists={playlists}
        media={media}
        loading={loading}
        editingId={editingId}
        savingId={savingId}
        onEdit={setEditingId}
        onLocalChange={handleLocalChange}
        onSave={handleSave}
        onDelete={handleDelete}
        onPreview={setPreviewItem}
      />

      <CmsMediaPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        getMediaSrc={getMediaSrc}
      />
    </div>
  );
}
