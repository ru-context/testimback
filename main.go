package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Request received: %s %s", r.Method, r.URL.Path)
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		http.Error(w, "Could not parse template", http.StatusInternalServerError)
		log.Printf("Error parsing template: %v", err)
		return
	}

	err = tmpl.Execute(w, nil)
	if err != nil {
		http.Error(w, "Could not render template", http.StatusInternalServerError)
		log.Printf("Error rendering template: %v", err)
		return
	}
}

func main() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	http.HandleFunc("/", homeHandler)

	serverAddr := ":8000"
	log.Printf("Starting server on http://localhost%s\n", serverAddr)
	log.Println("Press 'q' to stop the server.")

	go func() {
		if err := http.ListenAndServe(serverAddr, nil); err != nil {
			log.Fatalf("Could not start server: %v", err)
		}
	}()

	go func() {
		var input string
		for {
			_, err := fmt.Scanln(&input)
			if err == nil && input == "q" {
				log.Println("Shutting down server...")
				stop <- syscall.SIGTERM
				break
			}
		}
	}()

	<-stop
	log.Println("Server stopped.")
}
