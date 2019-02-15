# Wilbur and Strings
[CF596E]

Wilbur the pig now wants to play with strings. He has found an n by m table consisting only of the digits from 0 to 9 where the rows are numbered 1 to n and the columns are numbered 1 to m. Wilbur starts at some square and makes certain moves. If he is at square (x, y) and the digit d (0 ≤ d ≤ 9) is written at position (x, y), then he must move to the square (x + ad, y + bd), if that square lies within the table, and he stays in the square (x, y) otherwise. Before Wilbur makes a move, he can choose whether or not to write the digit written in this square on the white board. All digits written on the whiteboard form some string. Every time a new digit is written, it goes to the end of the current string.  
Wilbur has q strings that he is worried about. For each string si, Wilbur wants to know whether there exists a starting position (x, y) so that by making finitely many moves, Wilbur can end up with the string si written on the white board.

给定一个$n \times m$的网格图，每一个格子上对应一个$0-9$的数字。当到达数字为$i$的格子时，下一步必须按照向量$i$的方向移动到另一个格子上。如果移动出了格子则不动。对于所有经过的格子，可以选择把经过的格子中的数按顺序记录下来，也可以选择不记录某个数。现在给出若干个询问，每一个询问是一个由$0-9$组成的字符串，问这些字符串是否可能是记录的数列。

对于每一个格子，设计$Trans[u][v][d]$表示从$u,v$点出发下一个写下的字符是$d$的有限状态自动机，$O(n^2)$预处理序列自动机，然后$O(Qn^2)$回答询问。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

class Pos{
public:
	int x,y;
};

const int maxN=210;
const int maxStr=1010000;
const int maxAlpha=10;
const Pos Zero=((Pos){0,0});
const int inf=2147483647;

int n,m,Q;
int Dx[maxAlpha],Dy[maxAlpha];
char Map[maxN][maxN],Input[maxStr];
Pos Trans[maxN][maxN][maxAlpha];
Pos St[maxN*maxN];
bool vis[maxN][maxN];

void dfs(int x,int y,int d);
bool operator == (Pos A,Pos B);

int main()
{
	scanf("%d%d%d",&n,&m,&Q);
	for (int i=1;i<=n;i++) scanf("%s",Map[i]+1);
	for (int i=1;i<=n;i++) for (int j=1;j<=m;j++) Map[i][j]-='0';
	for (int i=0;i<=9;i++) scanf("%d%d",&Dx[i],&Dy[i]);

	mem(vis,0);
	for (int i=1;i<=n;i++) for (int j=1;j<=m;j++) if (vis[i][j]==0) dfs(i,j,1);

	while (Q--){
		mem(vis,0);scanf("%s",Input+1);
		bool getans=0;int len=strlen(Input+1);
		for (int i=1;i<=len;i++) Input[i]-='0';
		for (int bx=1;bx<=n;bx++)
			for (int by=1;by<=m;by++)
				if ((Map[bx][by]==Input[1])&&(vis[bx][by]==0)){
					int x=bx,y=by;bool flag=1;vis[x][y]=1;
					for (int i=2;i<=len;i++){
						if (Trans[x][y][Input[i]]==Zero){
							flag=0;break;
						}
						int xx=Trans[x][y][Input[i]].x,yy=Trans[x][y][Input[i]].y;
						x=xx;y=yy;vis[x][y]=1;
					}
					if (flag){
						getans=1;break;
					}
				}
		if (getans) printf("YES\n");
		else printf("NO\n");
	}

	return 0;
}

void dfs(int x,int y,int d){
	for (int i=d-1;i>=1;i--)
		if (Trans[St[i].x][St[i].y][Map[x][y]]==Zero) Trans[St[i].x][St[i].y][Map[x][y]]=((Pos){x,y});
		else break;
	if (vis[x][y]){
		for (int i=0;i<maxAlpha;i++)
			if (!(Trans[x][y][i]==Zero))
				for (int j=d-1;j>=1;j--)
					if (Trans[St[j].x][St[j].y][i]==Zero) Trans[St[j].x][St[j].y][i]=Trans[x][y][i];
					else break;
		return;
	}
	vis[x][y]=1;St[d]=((Pos){x,y});
	int xx=x+Dx[Map[x][y]],yy=y+Dy[Map[x][y]];
	if ((xx<=0)||(xx>n)||(yy<=0)||(yy>m)) Trans[x][y][Map[x][y]]=((Pos){x,y});
	else dfs(xx,yy,d+1);
	return;
}

bool operator == (Pos A,Pos B){
	return (A.x==B.x)&&(A.y==B.y);
}
```