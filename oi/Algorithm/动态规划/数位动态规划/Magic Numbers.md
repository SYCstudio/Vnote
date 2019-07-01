# Magic Numbers
[CF628D]

多开一维把余数记在后面即可。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=2010;
const int Mod=1e9+7;

int M,D;
char In[maxN];
int L[maxN],R[maxN];
int F[2][maxN][maxN];
int G[2][maxN][maxN];

int Calc(int len,int *Num);
int dfs(int i,int b,int t,int res,int *Num);
void Plus(int &x,int y);
int main(){
    scanf("%d%d",&M,&D);
    scanf("%s",In+1);int l1=strlen(In+1);for (int i=1;i<=l1;i++) L[i]=In[i]-'0';reverse(&L[1],&L[l1+1]);
    scanf("%s",In+1);int l2=strlen(In+1);for (int i=1;i<=l2;i++) R[i]=In[i]-'0';reverse(&R[1],&R[l2+1]);
    ++R[1];for (int i=1;i<=l2;i++) R[i+1]+=R[i]/10,R[i]%=10;
    if (R[l2+1]) ++l2;

    memset(F,-1,sizeof(F));
    printf("%d\n",(Calc(l2,R)-Calc(l1,L)+Mod)%Mod);
    return 0;
}
void Plus(int &x,int y){
    x+=y;if (x>=Mod) x-=Mod;return;
}
int Calc(int len,int *Num){
    memset(G,-1,sizeof(G));int ret=0;
    for (int i=len;i>=1;i--)
        for (int j=1,up=(i==len?Num[len]:9);j<=up;j++)
            if (j!=D){
                //cout<<i<<" "<<j<<" "<<dfs(i-1,(i==len&&j==up),1,j,Num)<<endl;
                ret=(ret+dfs(i-1,(i==len&&j==Num[len]),1,j%M,Num))%Mod;
        }
    //cout<<ret<<endl;
    return ret;
}
int dfs(int i,int b,int r,int res,int *Num){
    if (i==0){
        if (b==0&&res==0) return 1;
        return 0;
    }
    if (b==0&&F[r][i][res]!=-1) return F[r][i][res];
    if (b==1&&G[r][i][res]!=-1) return G[r][i][res];
    int ret=0;
    if (r){
        if (b==1&&D>Num[i]) return 0;
        ret=dfs(i-1,(b==1&&D==Num[i]),0,(res*10+D)%M,Num);
    }
    else
        for (int k=0,up=b?Num[i]:9;k<=up;k++)
            if (k!=D)
                Plus(ret,dfs(i-1,(b==1&&k==up),1,(res*10+k)%M,Num));
    
    if (b==0) F[r][i][res]=ret;
    else G[r][i][res]=ret;
    return ret;
}
```