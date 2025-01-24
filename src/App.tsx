import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { getTheme } from "./theme";
import { useState } from "react";
import { DarkMode } from "@mui/icons-material";

type Expence = {
  id: number;
  name: string;
  cost: string;
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [budget, setBudget] = useState<string>("");
  const [expences, setExpences] = useState<Expence[]>([]);
  const [newExpence, setNewExpence] = useState<Expence>({
    id: Date.now(),
    name: "",
    cost: "",
  });
  const [error, setError] = useState<{ name: string; cost: string }>({
    name: "",
    cost: "",
  });

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => !prevMode); // Переключаем режим
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^0-9.]/g, ""); // Удаляет все, кроме цифр и точки
    setBudget(numericValue);
  };

  const handleNewExpenceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Expence
  ) => {
    setNewExpence({ ...newExpence, [field]: e.target.value });
  };

  const handleExpenceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: keyof Expence
  ) => {
    setExpences(
      expences.map((expence) =>
        expence.id === id ? { ...expence, [field]: e.target.value } : expence
      )
    );
  };

  const handleAddExpence = () => {
    // Проверка на пустые поля при добавлении нового элемента
    if (!newExpence.name || !newExpence.cost) {
      setError({
        name: !newExpence.name ? "Введите название" : "",
        cost: !newExpence.cost ? "Введите стоимость" : "",
      });
      return;
    }

    setExpences([...expences, newExpence]);
    setNewExpence({ id: Date.now(), name: "", cost: "" }); // Очищает поля ввода после добавления
    setError({ name: "", cost: "" }); // Сбрасываем ошибки
  };

  const handleDeleteExpence = (id: number) => {
    // const expenceToDelete = expences.find((expence) => expence.id === id);

    // // Проверка, что расходы не пустые
    // if (expenceToDelete && (!expenceToDelete.name || !expenceToDelete.cost)) {
    //   alert("Невозможно удалить строку с пустыми полями");
    //   return;
    // }

    setExpences(expences.filter((expence) => expence.id !== id));
  };

  const handleCostChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Expence
  ) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Разрешаем только цифры
    setNewExpence({ ...newExpence, [field]: numericValue });
  };

  const handleCostExpenceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: keyof Expence
  ) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Разрешаем только цифры
    setExpences(
      expences.map((expence) =>
        expence.id === id ? { ...expence, [field]: numericValue } : expence
      )
    );
  };

  // Подсчет общей стоимости всех расходов
  const totalExpences = expences.reduce(
    (total, expence) => total + (parseFloat(expence.cost) || 0),
    0
  );

  // Остаток
  const remainingBudget = parseFloat(budget) - totalExpences;

  return (
    <ThemeProvider theme={getTheme(darkMode ? "dark" : "light")}>
      <div
        className="flex flex-col items-center justify-center min-h-screen overflow-hidden"
        style={{
          backgroundColor: darkMode ? "#121212" : "#fafafa",
          color: darkMode ? "#ffffff" : "#000000",
        }}
      >
        <div className="fixed top-0 left-0">
          <IconButton onClick={handleThemeToggle}>
            <DarkMode color="disabled" />
          </IconButton>
        </div>
        <Typography
          variant="h3"
          sx={{ marginInline: "auto", marginTop: "3rem", textAlign: "center" }}
        >
          Budget Buddy
        </Typography>
        <div className="m-15 mt-3 overflow-y-auto max-w-full">
          <FormControl sx={{ m: 2, marginLeft: 0, marginTop: 3 }}>
            <InputLabel htmlFor="outlined-adornment-amount">Бюджет</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">&#x20BD;</InputAdornment>
              }
              label="Бюджет"
              value={budget}
              onChange={handleBudgetChange}
            />
          </FormControl>

          <TableContainer
            component={Paper}
            sx={{ maxWidth: "35rem", width: "100%", overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Стоимость</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expences.map((expence) => (
                  <TableRow key={expence.id}>
                    <TableCell>
                      <TextField
                        value={expence.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleExpenceChange(e, expence.id, "name")
                        }
                        fullWidth
                        variant="outlined"
                        error={!expence.name} // Если поле пустое, показываем ошибку
                        helperText={!expence.name ? "Введите название" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth error={!expence.cost}>
                        <OutlinedInput
                          startAdornment={
                            <InputAdornment position="start">
                              &#x20BD;
                            </InputAdornment>
                          }
                          value={expence.cost}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleCostExpenceChange(e, expence.id, "cost")
                          }
                        />
                        {!expence.cost && (
                          <FormHelperText>Введите стоимость</FormHelperText>
                        )}
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeleteExpence(expence.id)}
                      >
                        Удалить
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Строка для добавления нового элемента */}
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Название"
                      variant="outlined"
                      value={newExpence.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleNewExpenceChange(e, "name")
                      }
                      fullWidth
                      error={!!error.name}
                      helperText={error.name}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth error={!!error.cost}>
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            &#x20BD;
                          </InputAdornment>
                        }
                        value={newExpence.cost}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCostChange(e, "cost")
                        }
                      />
                      {error.cost && (
                        <FormHelperText>{error.cost}</FormHelperText>
                      )}
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddExpence}
                    >
                      Добавить
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Typography
          variant="h5"
          sx={{ marginInline: "auto", marginBottom: "1rem" }}
        >
          Остаток: {remainingBudget >= 0 ? remainingBudget.toFixed(2) : "0.00"}{" "}
          &#x20BD;
        </Typography>
      </div>
    </ThemeProvider>
  );
}

export default App;
