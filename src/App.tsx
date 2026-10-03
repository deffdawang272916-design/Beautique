/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Calendar, Phone } from 'lucide-react';
import { Treatment, Product, TrainingCourse, CartItem, MachineItem } from './types';
import { CLINIC_INFO, TREATMENTS, PRODUCTS, TRAINING_COURSES } from './data/clinicData';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromotionsSection } from './components/PromotionsSection';
import { TreatmentsSection } from './components/TreatmentsSection';
import { TreatmentDetailModal } from './components/TreatmentDetailModal';
import { ProductsSection } from './components/ProductsSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { MachinesSection } from './components/MachinesSection';
import { MachineDetailModal } from './components/MachineDetailModal';
import { MachineInquiryModal } from './components/MachineInquiryModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TrainingSection } from './components/TrainingSection';
import { TrainingDetailModal } from './components/TrainingDetailModal';
import { EnrollmentModal } from './components/EnrollmentModal';
import { BookingModal } from './components/BookingModal';
import { AppointmentStatusModal } from './components/AppointmentStatusModal';
import { StaffPortalModal } from './components/StaffPortalModal';
import { TransformationsSection } from './components/TransformationsSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AiChatbot } from './components/AiChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('beautech_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'local' | 'luzon'>('pickup');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTreatmentId, setBookingTreatmentId] = useState<string | undefined>(undefined);
  const [isStatusLookupOpen, setIsStatusLookupOpen] = useState(false);
  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);

  // Modals for detail inspection
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [enrollingCourse, setEnrollingCourse] = useState<TrainingCourse | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<MachineItem | null>(null);
  const [inquiringMachine, setInquiringMachine] = useState<MachineItem | null>(null);
  const [isMachineInquiryOpen, setIsMachineInquiryOpen] = useState(false);

  const handleOpenMachineInquiry = (machine: MachineItem) => {
    setInquiringMachine(machine);
    setIsMachineInquiryOpen(true);
  };

  // Dedicated AI Concierge Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('beautech_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, productName: product.name, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleDirectOrder = (product: Product) => {
    handleAddToCart(product, 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOpenBooking = (treatmentId?: string) => {
    setBookingTreatmentId(treatmentId);
    setIsBookingOpen(true);
  };

  const handleProceedToCheckout = (chosenMethod: 'pickup' | 'local' | 'luzon') => {
    setShippingMethod(chosenMethod);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans flex flex-col selection:bg-[#E8D7C8] selection:text-[#3D2C24]">
      {/* Sticky Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        openBooking={handleOpenBooking}
        openChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onBookAppointment={() => handleOpenBooking()}
              onExploreShop={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreAcademy={() => {
                setActiveTab('training');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreTreatments={() => {
                setActiveTab('treatments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreMachines={() => {
                setActiveTab('machines');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Verified BER Months Promotional Campaigns */}
            <PromotionsSection
              onBookAppointment={handleOpenBooking}
              onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
            />

            {/* Featured Treatments Highlight */}
            <TreatmentsSection
              onBookAppointment={handleOpenBooking}
              onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
            />

            {/* Featured Skincare Shop */}
            <ProductsSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenBooking={handleOpenBooking}
              onOpenChat={() => setIsChatOpen(true)}
            />

            {/* Aesthetic Machines & Equipment */}
            <MachinesSection
              onSelectMachine={(machine) => setSelectedMachine(machine)}
              onOpenInquiry={handleOpenMachineInquiry}
            />

            {/* Aesthetic Training Academy */}
            <TrainingSection
              onSelectCourse={(course) => setSelectedCourse(course)}
              onEnroll={(course) => setEnrollingCourse(course)}
            />

            {/* Transformations / Before & After */}
            <TransformationsSection />

            {/* About Beautique Aesthetics Santa Rosa */}
            <AboutSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreAcademy={() => {
                setActiveTab('training');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Verified Testimonials */}
            <TestimonialsSection />

            {/* FAQs Accordion */}
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />

            {/* Location & Contact Section */}
            <ContactSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreShop={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {activeTab === 'promotions' && (
          <div className="pt-2">
            <PromotionsSection
              onBookAppointment={handleOpenBooking}
              onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
            />
            <TreatmentsSection
              onBookAppointment={handleOpenBooking}
              onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
            />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
          </div>
        )}

        {activeTab === 'treatments' && (
          <div className="pt-2">
            <TreatmentsSection
              onBookAppointment={handleOpenBooking}
              onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
            />
            <TransformationsSection />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="pt-2">
            <ProductsSection
              onSelectProduct={(product) => setSelectedProduct(product)}
              onOpenBooking={handleOpenBooking}
              onOpenChat={() => setIsChatOpen(true)}
            />
            <TestimonialsSection />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="pt-2">
            <MachinesSection
              onSelectMachine={(machine) => setSelectedMachine(machine)}
              onOpenInquiry={handleOpenMachineInquiry}
            />
            <ContactSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreShop={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
          </div>
        )}

        {activeTab === 'training' && (
          <div className="pt-2">
            <TrainingSection
              onSelectCourse={(course) => setSelectedCourse(course)}
              onEnroll={(course) => setEnrollingCourse(course)}
            />
            <AboutSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreAcademy={() => setActiveTab('training')}
            />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="pt-2">
            <TransformationsSection />
            <TestimonialsSection />
            <TreatmentsSection
              onBookAppointment={handleOpenBooking}
              onSelectTreatment={(treatment) => setSelectedTreatment(treatment)}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="pt-2">
            <AboutSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreAcademy={() => {
                setActiveTab('training');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <TestimonialsSection />
            <ContactSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreShop={() => setActiveTab('products')}
            />
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="pt-2">
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
            <ContactSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreShop={() => setActiveTab('products')}
            />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-2">
            <ContactSection
              onBookAppointment={() => handleOpenBooking()}
              onExploreShop={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <FaqSection onOpenChat={() => setIsChatOpen(true)} />
          </div>
        )}
      </main>

      {/* Floating Action Triggers with Safe Area Insets */}
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-3.5 sm:left-6 sm:bottom-6 z-40 flex items-center gap-2">
        <a
          href={CLINIC_INFO.contact.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center gap-2 bg-[#0084FF] hover:bg-blue-600 text-white text-xs font-semibold sm:py-2.5 sm:px-3.5 rounded-full shadow-lg transition-transform active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Message Beautique on Facebook Messenger"
          aria-label="Message on Facebook Messenger"
        >
          <MessageCircle className="w-5 h-5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden sm:inline">Messenger</span>
        </a>
      </div>

      {!isChatOpen && (
        <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-3.5 sm:right-6 sm:bottom-6 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-stone-800 text-stone-50 border border-stone-700 text-xs font-medium sm:py-2.5 sm:px-4 rounded-full shadow-xl transition-transform active:scale-95 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Open Beautique AI Concierge"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <Sparkles className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">Ask AI Concierge</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBookAppointment={() => handleOpenBooking()}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenStatusLookup={() => setIsStatusLookupOpen(true)}
        onOpenStaffPortal={() => setIsStaffPortalOpen(true)}
      />

      {/* Modals & Overlays */}
      <TreatmentDetailModal
        treatment={selectedTreatment}
        onClose={() => setSelectedTreatment(null)}
        onBook={handleOpenBooking}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenBooking={(treatmentName) => handleOpenBooking(treatmentName)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      <MachineDetailModal
        machine={selectedMachine}
        onClose={() => setSelectedMachine(null)}
        onOpenInquiry={handleOpenMachineInquiry}
      />

      <MachineInquiryModal
        machine={inquiringMachine}
        isOpen={isMachineInquiryOpen}
        onClose={() => {
          setIsMachineInquiryOpen(false);
          setInquiringMachine(null);
        }}
      />

      <TrainingDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnroll={(course) => setEnrollingCourse(course)}
      />

      <EnrollmentModal
        course={enrollingCourse}
        onClose={() => setEnrollingCourse(null)}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTreatmentId={bookingTreatmentId}
      />

      <AppointmentStatusModal
        isOpen={isStatusLookupOpen}
        onClose={() => setIsStatusLookupOpen(false)}
      />

      <StaffPortalModal
        isOpen={isStaffPortalOpen}
        onClose={() => setIsStaffPortalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        shippingMethod={shippingMethod}
        onClearCart={handleClearCart}
      />

      <AiChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />
    </div>
  );
}
