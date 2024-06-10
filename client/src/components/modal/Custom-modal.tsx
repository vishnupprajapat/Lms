"use client";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";

interface CustomModalProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
export const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};
