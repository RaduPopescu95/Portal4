import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  startAfter,
  endBefore,
  limit,
  limitToLast,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useCollectionPagination = (collectionPath, pageSize) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);

  const fetchTotalCount = async () => {
    const ref = collection(db, collectionPath);
    const snapshot = await getDocs(query(ref));
    const total = snapshot.size;
    setTotalItems(total);
    setTotalPages(Math.ceil(total / pageSize));
  };

  const fetchItems = async (page) => {
    const ref = collection(db, collectionPath);
    let pageQuery;

    if (page === 1) {
      pageQuery = query(
        ref,
        orderBy("firstUploadDate", "desc"),
        limit(pageSize)
      );
      setLastVisible(null);
      setFirstVisible(null);
    } else if (page > currentPage) {
      pageQuery = lastVisible
        ? query(
            ref,
            orderBy("firstUploadDate", "desc"),
            startAfter(lastVisible),
            limit(pageSize)
          )
        : null;
    } else {
      pageQuery = firstVisible
        ? query(
            ref,
            orderBy("firstUploadDate", "desc"),
            endBefore(firstVisible),
            limitToLast(pageSize)
          )
        : null;
    }

    if (!pageQuery) return;

    const documentSnapshots = await getDocs(pageQuery);
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(newItems);

    if (documentSnapshots.docs.length > 0) {
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setFirstVisible(documentSnapshots.docs[0]);
    }
  };

  useEffect(() => {
    fetchItems(currentPage); // Initial fetch and subsequent fetches on page changes
    fetchTotalCount();
  }, []); // Dependency array includes currentPage to trigger re-fetch on change

  const nextPage = async () => {
    if (lastVisible) {
      const postsRef = collection(db, collectionPath);
      const nextQuery = query(
        postsRef,
        orderBy("firstUploadDate", "desc"),
        startAfter(lastVisible), // Ensure this is the document snapshot
        limit(pageSize)
      );
      const documentSnapshots = await getDocs(nextQuery);
      const newPosts = documentSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(newPosts);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setFirstVisible(documentSnapshots.docs[0]); // Update firstVisible for reverse pagination
    }
  };

  const previousPage = async () => {
    if (firstVisible) {
      const postsRef = collection(db, collectionPath);
      const prevQuery = query(
        postsRef,
        orderBy("firstUploadDate", "desc"),
        endBefore(firstVisible), // Change to endBefore for correct backward pagination
        limitToLast(pageSize)
      );
      const documentSnapshots = await getDocs(prevQuery);
      const newPosts = documentSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(newPosts);
      setFirstVisible(documentSnapshots.docs[0]);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]); // Update lastVisible for forward pagination
    }
  };

  return {
    items,
    currentPage,
    totalPages,
    setCurrentPage,
    previousPage,
    nextPage,
    setItems,
  };
};
