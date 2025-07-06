import { useEffect, useState } from 'react'
import { addToWishList, removeToWishList } from 'utils/cart'

export function useLocalLike(key: string) {
  const [likes, setLikes] = useState<Set<number>>(new Set())

  useEffect(() => {
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setLikes(new Set(parsed))
        }
      } catch (e) {
        console.error('Invalid localStorage for likes:', e)
      }
    }
  }, [key])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(Array.from(likes)))
  }, [key, likes])

  const toggleLike = (id: number) => {
    setLikes((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
        removeToWishList(id);
      } else {
        updated.add(id);
        addToWishList(id);
      }
      return updated;
    });
  };

  const hasLiked = (id: number) => likes.has(id)

  return { likes, toggleLike, hasLiked }
}
