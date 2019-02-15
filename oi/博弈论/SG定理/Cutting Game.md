# Cutting Game
[POJ2311]

Urej loves to play various types of dull games. He usually asks other people to play with him. He says that playing those games can show his extraordinary wit. Recently Urej takes a great interest in a new game, and Erif Nezorf becomes the victim. To get away from suffering playing such a dull game, Erif Nezorf requests your help. The game uses a rectangular paper that consists of W*H grids. Two players cut the paper into two pieces of rectangular sections in turn. In each turn the player can cut either horizontally or vertically, keeping every grids unbroken. After N turns the paper will be broken into N+1 pieces, and in the later turn the players can choose any piece to cut. If one player cuts out a piece of paper with a single grid, he wins the game. If these two people are both quite clear, you should write a problem to tell whether the one who cut first can win or not. 

一个 $n \times m$ 的后记状态是若干两个 $Nim$ 游戏的和，那么运用 $Multi-SG$ 的理论，游戏的和等于其 $SG$ 值的异或和，提前处理出 $SG$ 函数即可以快速计算。  
似乎需要从 $2$ 开始枚举，不然以 $2$ 开头的矩阵的 $SG$　值会算错。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=210;
const int inf=2147483647;

int SG[maxN][maxN];
bool use[maxN*maxN];

int main(){
	mem(SG,-1);
	int W,H;
	for (int i=2;i<maxN;i++)
		for (int j=2;j<maxN;j++){
			for (int k=2;k<=i-2;k++) use[SG[k][j]^SG[i-k][j]]=1;
			for (int k=2;k<=j-2;k++) use[SG[i][k]^SG[i][j-k]]=1;
			SG[i][j]=0;while (use[SG[i][j]]) SG[i][j]++;
			for (int k=2;k<=i-2;k++) use[SG[k][j]^SG[i-k][j]]=0;
			for (int k=2;k<=j-2;k++) use[SG[i][k]^SG[i][j-k]]=0;
		}
	while (scanf("%d%d",&W,&H)!=EOF){
		if (SG[W][H]==0) printf("LOSE\n");
		else printf("WIN\n");
	}
}
```