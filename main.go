package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

var (
	serverAddr     = ":8000"
	logRequests    = true
	serverInstance *http.Server
	serverMutex    sync.Mutex
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
	if logRequests {
		log.Printf("Request received: %s %s", r.Method, r.URL.Path)
	}

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

func printHelp() {
	fmt.Println("Available commands:")
	fmt.Println("  q - Quit the server")
	fmt.Println("  s - Show server status")
	fmt.Println("  r - Restart the server")
	fmt.Println("  l - Toggle request logging (currently:", logRequests, ")")
}

func startServer() {
	serverMutex.Lock()
	defer serverMutex.Unlock()

	serverInstance = &http.Server{
		Addr:    serverAddr,
		Handler: nil,
	}

	log.Printf("Starting server on http://localhost%s\n", serverAddr)
	go func() {
		if err := serverInstance.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Could not start server: %v", err)
		}
	}()
}

func stopServer() {
	serverMutex.Lock()
	defer serverMutex.Unlock()

	if serverInstance != nil {
		log.Println("Shutting down server...")
		if err := serverInstance.Close(); err != nil {
			log.Printf("Error shutting down server: %v", err)
		}
		serverInstance = nil
	}
}

func main() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	http.HandleFunc("/", homeHandler)
	startServer()
	log.Println("Press 'h' to see available commands.")

	go func() {
		var input string
		for {
			fmt.Print("> ")
			_, err := fmt.Scanln(&input)
			if err != nil {
				continue
			}

			switch input {
			case "h":
				printHelp()
			case "q":
				log.Println("Shutting down server...")
				stop <- syscall.SIGTERM
				return
			case "s":
				log.Println("Server is running on http://localhost" + serverAddr)
			case "r":
				log.Println("Restarting server...")
				stopServer()
				time.Sleep(1 * time.Second)
				startServer()
			case "l":
				logRequests = !logRequests
				log.Println("Request logging is now:", logRequests)
			default:
				fmt.Println("Unknown command. Press 'h' for help.")
			}
		}
	}()

	<-stop
	stopServer()
	log.Println("Server stopped.")
}
