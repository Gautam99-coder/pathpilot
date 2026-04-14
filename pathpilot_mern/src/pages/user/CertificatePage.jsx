  
import { useSearchParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const title = searchParams.get("title") || "Course";
  const [userName, setUserName] = useState("...");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setUserName(d.name || 'Graduate'));
  }, []);

  const certRef = useRef();

  const downloadCertificate = async () => {
    try {
      setIsGenerating(true);
      
      // Wait for any animations or rendering to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = certRef.current;
      if (!element) {
        throw new Error('Certificate element not found');
      }

      // Create canvas with specific options to avoid CSS parsing issues
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        width: 900,
        height: 600,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Ignore elements that might cause issues
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
        }
      });
      
      const imgData = canvas.toDataURL("image/png", 1.0);
      
      if (!imgData || imgData === 'data:,') {
        throw new Error('Failed to generate image data');
      }
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [900, 600]
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 900, 600);
      
      const fileName = `${title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_Certificate.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      
      // Fallback: try with different settings
      try {
        const canvas = await html2canvas(certRef.current, { 
          scale: 1,
          useCORS: false,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff"
        });
        
        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        const pdf = new jsPDF("landscape");
        
        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = 210; // A4 landscape height in mm
        
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(`${title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_Certificate.pdf`);
        
      } catch (fallbackError) {
        console.error("Fallback PDF Generation Error:", fallbackError);
        alert(`Failed to generate PDF: ${error.message}. Please try using a different browser or contact support.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

      {/* CERTIFICATE */}
      <div
        ref={certRef}
        className="certificate-container"
        style={{
          width: '900px',
          height: '600px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '40px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}
      >

        {/* BORDER */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          bottom: '16px',
          border: '4px solid #6366f1',
          borderRadius: '12px'
        }}></div>

        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          Certificate of Completion
        </h1>

        <p style={{
          color: '#6b7280',
          marginBottom: '24px',
          fontSize: '18px'
        }}>
          This is proudly presented to
        </p>

        <h2 style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: '#6366f1',
          marginBottom: '24px'
        }}>
          {userName}
        </h2>

        <p style={{
          color: '#6b7280',
          marginBottom: '8px',
          fontSize: '18px'
        }}>
          for successfully completing
        </p>

        <h3 style={{
          fontSize: '32px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#1f2937'
        }}>
          {title}
        </h3>

        <p style={{
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          Issued on {new Date().toLocaleDateString()}
        </p>

        {/* SIGNATURES */}
        <div style={{
          position: 'absolute',
          bottom: '64px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-around',
          paddingLeft: '80px',
          paddingRight: '80px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '160px',
              height: '1px',
              backgroundColor: '#d1d5db',
              margin: '0 auto 8px'
            }} />
            <p style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>RKU Authority</p>
            <p style={{
              fontSize: '10px',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Executive Director</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '160px',
              height: '1px',
              backgroundColor: '#d1d5db',
              margin: '0 auto 8px'
            }} />
            <p style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>PathPilot Team</p>
            <p style={{
              fontSize: '10px',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Lead Instructor</p>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        <button
          onClick={downloadCertificate}
          disabled={isGenerating}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg transition-all"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Certificate
            </>
          )}
        </button>
      </div>

    </div>
  );
}
