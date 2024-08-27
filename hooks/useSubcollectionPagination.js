import { useState, useEffect } from "react";
import {
  collection,
  doc,
  query,
  orderBy,
  getDocs,
  startAfter,
  endBefore,
  limit,
  limitToLast,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useSubcollectionPagination = (
  parentDocPath,
  subCollectionPath,
  pageSize
) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);

  const fetchTotalCount = async () => {
    const parentRef = doc(db, parentDocPath);
    const ref = collection(parentRef, subCollectionPath);
    const snapshot = await getDocs(query(ref));
    const total = snapshot.size;
    setTotalItems(total);
    setTotalPages(Math.ceil(total / pageSize));
  };

  const fetchItems = async (page) => {
    const parentRef = doc(db, parentDocPath);
    const ref = collection(parentRef, subCollectionPath);
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
    fetchTotalCount();
    fetchItems(currentPage);
  }, [parentDocPath, subCollectionPath, currentPage]);

  return { items, currentPage, totalPages, setCurrentPage };
};
